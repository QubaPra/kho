import { useState, useEffect, useCallback } from "react";
import CategoryDropdown from "../components/CategoryDropdown";
import CommentsSection from "../components/CommentsSection";
import MonthDropdown from "../components/MonthDropdown";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import ViewTrial from "./ViewTrial";

const monthMap = {
  styczeń: "01",
  luty: "02",
  marzec: "03",
  kwiecień: "04",
  maj: "05",
  czerwiec: "06",
  lipiec: "07",
  sierpień: "08",
  wrzesień: "09",
  październik: "10",
  listopad: "11",
  grudzień: "12",
};

const Dashboard = ({ user, setUser }) => {
  const [trial, setTrial] = useState(() => {
    const savedTrial = localStorage.getItem("trial");
    return savedTrial ? JSON.parse(savedTrial) : "";
  });
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editCategories, setEditCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrialData = async () => {
      try {
        const response = await axios.get("/trials/me");
        const trialData = response.data;

        // Formatowanie dat zadań
        const formattedTasks = trialData.tasks.map((task) => {
          if (!task.end_date || !/^\d{2}-\d{4}$/.test(task.end_date)) {
            return {
              ...task,
              end_date: "",
            };
          }
          const [month, year] = task.end_date.split("-");
          const monthName = Object.keys(monthMap).find(
            (key) => monthMap[key] === month
          );
          const formattedEndDate = `${monthName} ${year}`;
          return {
            ...task,
            end_date: formattedEndDate,
          };
        });

        setTrial(trialData);
        setTasks(formattedTasks);
        setComments(trialData.comments);

        // Zapisz dane w localStorage
        localStorage.setItem("trial", JSON.stringify(trialData));
        localStorage.setItem("tasks", JSON.stringify(formattedTasks));
      } catch (error) {
        console.error("Błąd podczas pobierania danych próby:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania kategorii:", error);
      }
    };

    fetchTrialData();
    fetchCategories();
  }, []);

  const getLatestEndDate = useCallback((tasks) => {
    if (tasks.length === 0) return "";
    const dates = tasks
      .map((task) => {
        if (!task.end_date) {
          return NaN; // Sprawdzenie, czy endDate jest zdefiniowane
        }
        const [monthName, year] = task.end_date.split(" ");
        const month = monthMap[monthName.toLowerCase()];
        if (!month || !year) {
          return NaN;
        }
        return new Date(`${year}-${month}-01`);
      })
      .filter((date) => !isNaN(date));
    if (dates.length === 0) return "";
    const latestDate = new Date(Math.max(...dates));
    return latestDate.toLocaleDateString("pl-PL", {
      month: "long",
      year: "numeric",
    });
  }, []);

  const handleDeleteTrial = async () => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć tę próbę?");
    if (confirmed) {
      try {
        await axios.delete("/trials/me");
        localStorage.removeItem("trial");
        localStorage.removeItem("tasks");
        setUser((prevUser) => ({ ...prevUser, has_trial: false }));
        navigate("/nowa-proba");
      } catch (error) {
        console.error("Błąd podczas usuwania próby:", error);
        alert("Wystąpił błąd podczas usuwania próby.");
      }
    }
  };

  useEffect(() => {
    const textareas = document.querySelectorAll(".auto-resize-textarea");
    textareas.forEach((textarea) => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }, [editContent, trial]);

  const handleEditClick = async (task) => {
    setEditTaskId(task.id);
    setEditContent(task.content);
    setEditEndDate(task.end_date);
    setEditCategories(task.categories);
  };

  const handleApproveClick = async () => {
    if (
      editContent.trim() === "" &&
      editEndDate.trim() === "" &&
      editCategories.length === 0
    ) {
      await handleDeleteTask(editTaskId);
    } else {
      if (
        trial.status != "do akceptacji przez opiekuna" &&
        trial.status != "odrzucona przez kapitułę (do poprawy)" &&
        trial.status &&
        !trial.status.includes("(edytowano)")
      ) {
        const confirmed = window.confirm(
          "Uwaga edytujesz zatwierdzoną próbę. Czy chcesz kontynuować?"
        );
        if (!confirmed) {
          return;
        }
      }

      if (
        (trial.status &&
          trial.status.includes("zaakceptowana przez opiekuna")) ||
        trial.status === "odrzucona przez kapitułę (do poprawy)"
      ) {
        try {
          await axios.patch("/trials/me", {
            status: "do akceptacji przez opiekuna",
          });
          setTrial((prevTrial) => ({
            ...prevTrial,
            status: "do akceptacji przez opiekuna",
          }));
        } catch (error) {
          console.error("Błąd podczas aktualizacji statusu próby:", error);
          return;
        }
      } else if (
        trial.status &&
        !trial.status.includes("(edytowano)") &&
        trial.status != "do akceptacji przez opiekuna" &&
        trial.status != "odrzucona przez kapitułę (do poprawy)"
      ) {
        try {
          await axios.patch("/trials/me", {
            status: `${trial.status} (edytowano)`,
          });
          setTrial((prevTrial) => ({
            ...prevTrial,
            status: `${prevTrial.status} (edytowano)`,
          }));
        } catch (error) {
          console.error("Błąd podczas aktualizacji statusu próby:", error);
          return;
        }
      }

      try {
        let formattedEndDate = "";
        if (editEndDate.trim() !== "") {
          const [monthName, year] = editEndDate.split(" ");
          if (monthName && year && monthMap[monthName.toLowerCase()]) {
            formattedEndDate = `${monthMap[monthName.toLowerCase()]}-${year}`;
          }
        }
        const payload = {
          content: editContent,
          end_date: formattedEndDate,
          categories: editCategories,
        };

        const response = await axios.patch(`/tasks/${editTaskId}`, payload);
        setTasks(
          tasks.map((task) =>
            task.id === editTaskId
              ? {
                  ...task,
                  content: editContent,
                  end_date: editEndDate,
                  categories: editCategories,
                }
              : task
          )
        );

        localStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Błąd podczas aktualizacji zadania:", error);
      }
    }
    setEditTaskId(null);
  };

  const handleCancelClick = async () => {
    setEditTaskId(null);

    const originalTask = tasks.find((task) => task.id === editTaskId);

    if (
      originalTask.content.trim() === "" &&
      originalTask.end_date.trim() === "" &&
      originalTask.categories.length === 0
    ) {
      try {
        await axios.delete(`/tasks/${editTaskId}`);
        const updatedTasks = tasks.filter((task) => task.id !== editTaskId);
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      } catch (error) {
        console.error("Błąd podczas usuwania zadania:", error);
      }
    }
  };

  const handleSelectCategory = (category) => {
    setEditCategories([...new Set([...editCategories, category.id])]);
  };

  const handleRemoveCategory = (categoryId) => {
    setEditCategories(editCategories.filter((id) => id !== categoryId));
  };

  const getCategoriesByIds = useCallback(
    (ids) => categories.filter((category) => ids.includes(category.id)),
    [categories]
  );

  const handleAddTaskClick = async () => {
    try {
      const payload = {
        content: "",
        categories: [],
        end_date: "",
        trial: trial.id,
      };
      const response = await axios.post("/tasks/me", payload);
      const newTask = response.data;
      setTasks([...tasks, newTask]);
      setEditTaskId(newTask.id);
      setEditContent(newTask.content);
      setEditEndDate(newTask.end_date);
      setEditCategories(newTask.categories);
      localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));
    } catch (error) {
      console.error("Błąd podczas dodawania zadania:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (
        trial.status != "do akceptacji przez opiekuna" &&
        trial.status != "odrzucona przez kapitułę (do poprawy)" &&
        trial.status &&
        !trial.status.includes("(edytowano)")
      ) {
        const confirmed = window.confirm(
          "Uwaga edytujesz zatwierdzoną próbę. Czy chcesz kontynuować?"
        );
        if (!confirmed) {
          return;
        }
      }

      if (
        (trial.status &&
          trial.status.includes("zaakceptowana przez opiekuna")) ||
        trial.status === "odrzucona przez kapitułę (do poprawy)"
      ) {
        try {
          await axios.patch("/trials/me", {
            status: "do akceptacji przez opiekuna",
          });
          setTrial((prevTrial) => ({
            ...prevTrial,
            status: "do akceptacji przez opiekuna",
          }));
        } catch (error) {
          console.error("Błąd podczas aktualizacji statusu próby:", error);
          return;
        }
      } else if (
        trial.status &&
        !trial.status.includes("(edytowano)") &&
        trial.status != "do akceptacji przez opiekuna" &&
        trial.status != "odrzucona przez kapitułę (do poprawy)"
      ) {
        try {
          await axios.patch("/trials/me", {
            status: `${trial.status} (edytowano)`,
          });
          setTrial((prevTrial) => ({
            ...prevTrial,
            status: `${prevTrial.status} (edytowano)`,
          }));
        } catch (error) {
          console.error("Błąd podczas aktualizacji statusu próby:", error);
          return;
        }
      }
      await axios.delete(`/tasks/${taskId}`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Błąd podczas usuwania zadania:", error);
    }
  };

  const formatStatus = (status) => {
    if (!status) return "";
    const match = status.match(
      /^(Otwarta|Zamknięta) rozkazem ([^<]+) <(.+?)>(.*)$/
    );
    if (match) {
      const [_, type, orderNumber, orderLink, additionalText] = match;
      return (
        <span>
          {type} rozkazem{" "}
          <a
            className="underline hover:text-blue-500 dark:hover:text-blue-400"
            href={orderLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {orderNumber}
          </a>
          {additionalText}
        </span>
      );
    }
    return status;
  };

  const getAgeSuffix = (age) => {
    if (age === 1) return "rok";
    if (age % 10 >= 2 && age % 10 <= 4 && (age % 100 < 10 || age % 100 >= 20))
      return "lata";
    return "lat";
  };

  const handleAddReportClick = async () => {
    try {
      const response = await axios.get(`/trials/${trial.id}/report`);
      const reportUrl = response.data.message;
      localStorage.setItem(
        "trial",
        JSON.stringify({ ...trial, report: reportUrl })
      );
      setTrial((prevTrial) => ({
        ...prevTrial,
        report: reportUrl,
      }));
      window.open(reportUrl, "_blank");
    } catch (error) {
      console.error("Błąd podczas generowania raportu:", error);
    }
    console.log(JSON.parse(localStorage.getItem("trial")).report);
  };

  if (
    trial.status &&
    (trial.status.includes("(do zamknięcia)") ||
      trial.status.includes("Zamknięta"))
  ) {
    return <ViewTrial id={trial.id} user={user} />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow sm:p-6 p-4 mb-6">
      <div className="sm:flex items-center justify-between mb-2">
        <h2>
          {trial.rank} {user.full_name} próba na stopień HO
        </h2>
        <div className="flex space-x-2 sm:my-0 mb-2 mt-2">
          {trial.status === "do akceptacji przez opiekuna" ||
          trial.status === "odrzucona przez kapitułę (do poprawy)" ? (
            <button className="button-approve">
              <span className="material-symbols-outlined">list_alt_check</span>
              <span className="ml-2">Zgłoś próbę do opiekuna</span>
            </button>
          ) : (
            <button className="button-approve">
              <span className="material-symbols-outlined">calendar_add_on</span>
              <span className="ml-2">Zgłoś się na kapitułę</span>
            </button>
          )}

          {trial.status?.includes("Otwarta") && trial.report ? (
            <button
              className="button-approve"
              onClick={() => window.open(trial.report, "_blank")}
            >
              <span className="material-symbols-outlined">Summarize</span>
              <span className="ml-2">Edytuj raport</span>
            </button>
          ) : (
            trial.status?.includes("Otwarta") && (
              <button className="button-approve" onClick={handleAddReportClick}>
                <span className="material-symbols-outlined">add</span>
                <span className="ml-2">Dodaj raport</span>
              </button>
            )
          )}

          <Link
            to="/edycja-proby"
            className="material-symbols-outlined button-approve"
          >
            edit_square
          </Link>
          <button onClick={handleDeleteTrial}>
            <span className="material-symbols-outlined button-reject">
              delete
            </span>
          </button>
        </div>
      </div>
      <div className="flex space-x-4 sm:flex-row flex-col sm:space-y-0 space-y-2">
        <div className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-3 py-1 rounded-full sm:text-sm text-xs w-fit flex items-center space-x-1">
          <p className="font-semibold">Stan:</p>
          <span>{formatStatus(trial.status)}</span>
        </div>
        {getLatestEndDate(tasks) && (
          <div className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-3 py-1 rounded-full sm:text-sm text-xs w-fit flex items-center space-x-1">
            <p className="font-semibold">Data zakończenia:</p>
            <span>{getLatestEndDate(tasks)}</span>
          </div>
        )}
      </div>

      <div className="sm:grid flex sm:grid-cols-2 flex-col sm:grid-flow-col sm:grid-rows-3 gap-4 mt-6">
        <div>
          <p className="sm:text-sm text-xs text-gray-400">Email do kontaktu</p>
          <p className="font-medium">{trial.email}</p>
        </div>

        <div>
          <p className="sm:text-sm text-xs text-gray-400">Data urodzenia</p>
          <p className="font-medium">
            {new Date(trial.birth_date).toLocaleDateString("pl-PL")} (
            {Math.floor(
              (new Date() - new Date(trial.birth_date)) /
                (1000 * 60 * 60 * 24 * 365.25)
            )}{" "}
            {getAgeSuffix(
              Math.floor(
                (new Date() - new Date(trial.birth_date)) /
                  (1000 * 60 * 60 * 24 * 365.25)
              )
            )}
            )
          </p>
        </div>
        <div>
          <p className="sm:text-sm text-xs text-gray-400">Drużyna</p>
          <p className="font-medium">{trial.team}</p>
        </div>
        <div>
          <p className="sm:text-sm text-xs text-gray-400">Email opiekuna</p>
          <p className="font-medium">{trial.mentor_mail}</p>
        </div>
        <div>
          <p className="sm:text-sm text-xs text-gray-400">
            Imię i nazwisko opiekuna
          </p>
          <p className="font-medium">{trial.mentor_name}</p>
        </div>
      </div>

      <div className="sm:mt-12 mt-8">
        <div className="flex items-center space-x-1.5 sm:text-xl text-lg mb-4">
          <span className="material-symbols-outlined ">task_alt</span>
          <span className="sm:text-xl text-lg font-medium">Zadania</span>
        </div>
        <div className="space-y-4">
          {tasks.map((task, index) => {
            const taskCategories = getCategoriesByIds(
              editTaskId === task.id ? editCategories : task.categories
            );
            return (
              <div
                key={task.id}
                className="flex sm:flex-row flex-col sm:space-x-2 sm:space-y-0 space-y-2"
              >
                <div className="bg-white sm:block hidden content-center sm:w-10 w-full text-center dark:bg-gray-800 rounded-lg sm:p-4 p-2 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  {index + 1}
                </div>
                <div className="bg-white w-full dark:bg-gray-800 rounded-lg sm:p-4 p-2 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <div className="flex justify-between items-center mb-2">
                    <span>
                      {editTaskId === task.id ? (
                        <MonthDropdown
                          selectedDate={editEndDate}
                          onSelectDate={(date) => setEditEndDate(date)}
                        />
                      ) : (
                        <div className="w-full rounded-lg border border-white dark:border-gray-800 p-2 flex items-center space-x-1 justify-between ">
                          <span className="material-symbols-outlined ">
                            calendar_month
                          </span>
                          <p className={!task.end_date ? "opacity-50" : ""}>
                            {task.end_date || "Data zakończenia"}
                          </p>
                        </div>
                      )}
                    </span>
                    <div className="flex space-x-2 mr-2">
                      {editTaskId === task.id ? (
                        <>
                          <button
                            className="material-symbols-outlined text-green-600 hover:text-green-800"
                            onClick={handleApproveClick}
                          >
                            check
                          </button>
                          <button
                            className="material-symbols-outlined text-red-600 hover:text-red-800"
                            onClick={handleCancelClick}
                          >
                            close
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="material-symbols-outlined text-gray-400 hover:text-gray-600"
                            onClick={() => handleEditClick(task)}
                          >
                            edit
                          </button>
                          <button
                            className="material-symbols-outlined text-gray-400 hover:text-red-600"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    {editTaskId === task.id ? (
                      <textarea
                        className="auto-resize-textarea border-gray-200 dark:border-gray-700 w-full"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Treść zadania"
                        rows={1}
                      ></textarea>
                    ) : (
                      <textarea
                        className="auto-resize-textarea border-white dark:border-gray-800 w-full"
                        value={task.content}
                        rows={1}
                        placeholder="Treść zadania"
                        readOnly
                      ></textarea>
                    )}
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="flex flex-wrap space-x-2">
                      {taskCategories.map((category) =>
                        editTaskId === task.id ? (
                          <button
                            key={category.id}
                            className={`category-button ${category.bg_color} ${category.font_color} ${category.dark_bg_color} ${category.dark_font_color} px-3 py-1 my-1 rounded-full sm:text-sm text-xs w-fit flex items-center space-x-1`}
                            onClick={() => handleRemoveCategory(category.id)}
                          >
                            <span className="category-icon material-symbols-outlined">
                              {category.icon}
                            </span>
                            <span className="category-name">
                              {category.name}
                            </span>
                          </button>
                        ) : (
                          <div
                            key={category.id}
                            className={`${category.bg_color} ${category.font_color} ${category.dark_bg_color} ${category.dark_font_color} text-center px-3 py-1 my-1 rounded-full sm:text-sm text-xs w-fit flex items-center space-x-1`}
                          >
                            <span className="material-symbols-outlined">
                              {category.icon}
                            </span>
                            <span>{category.name}</span>
                          </div>
                        )
                      )}
                      {editTaskId === task.id && (
                        <CategoryDropdown
                          selectedCategories={editCategories}
                          onSelectCategory={handleSelectCategory}
                          categories={categories}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <button
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
            onClick={handleAddTaskClick}
          >
            <span className="material-symbols-outlined mr-1">add</span>
            Nowe zadanie
          </button>
        </div>
      </div>
      <CommentsSection
        comments={comments}
        trialId={trial.id}
        status={trial.status || ""}
      />
    </div>
  );
};

export default Dashboard;
