import { useState, useEffect } from "react";
import CategoryDropdown from "../components/CategoryDropdown";
import CommentsSection from "../components/CommentsSection";
import MonthDropdown from "../components/MonthDropdown";
import { Link } from "react-router-dom";
import axios from "../api/axios";

const Dashboard = ({ user }) => {
  const [trial, setTrial] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchTrialData = async () => {
      try {
        const response = await axios.get("/trials/me");
        console.log("Odpowiedź z API (fetchTrialData):", response.data);
        const trialData = response.data;

        // Formatowanie dat zadań
        const formattedTasks = trialData.tasks.map(task => {
          if (!task.end_date || !/^\d{2}-\d{4}$/.test(task.end_date)) {
            return {
              ...task,
              end_date: "",
            };
          }
          const [month, year] = task.end_date.split("-");
          const monthName = Object.keys(monthMap).find(key => monthMap[key] === month);
          const formattedEndDate = `${monthName} ${year}`;
          return {
            ...task,
            end_date: formattedEndDate,
          };
        });

        setTrial(trialData);
        setTasks(formattedTasks);
        setComments(trialData.comments || []);
      } catch (error) {
        console.error("Błąd podczas pobierania danych próby:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        console.log("Odpowiedź z API (fetchCategories):", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania kategorii:", error);
      }
    };

    fetchTrialData();
    fetchCategories();
  }, []);

  function getLatestEndDate(tasks) {
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
      .filter((date) => {
        const isValid = !isNaN(date);
        return isValid;
      });
    if (dates.length === 0) return "";
    const latestDate = new Date(Math.max(...dates));
    return latestDate.toLocaleDateString("pl-PL", {
      month: "long",
      year: "numeric",
    });
  }

  const handleDeleteTrial = async () => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć tę próbę?");
    if (confirmed) {
      try {
        await axios.delete("/trials/me");
        alert("Próba została usunięta.");
      } catch (error) {
        console.error("Błąd podczas usuwania próby:", error);
        alert("Wystąpił błąd podczas usuwania próby.");
      }
    }
  };

  const [editTaskId, setEditTaskId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editCategories, setEditCategories] = useState([]);

  useEffect(() => {
    const textareas = document.querySelectorAll(".auto-resize-textarea");
    textareas.forEach((textarea) => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  });

  const handleEditClick = (task) => {
    setEditTaskId(task.id);
    setEditContent(task.content);
    setEditEndDate(task.end_date);
    setEditCategories(task.categories);
  };

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

  const handleApproveClick = async () => {
    if (
      editContent.trim() === "" &&
      editEndDate.trim() === "" &&
      editCategories.length === 0
    ) {
      await handleDeleteTask(editTaskId);
    } else {
      try {
        console.log("editEndDate:", editEndDate);
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
        console.log("Wysyłany JSON (handleApproveClick):", payload); // Dodany console.log
        const response = await axios.patch(`/tasks/${editTaskId}`, payload);
        console.log("Odpowiedź z API:", response.data);
        setTasks(
          tasks.map((task) =>
            task.id === editTaskId
              ? {
                  ...task,
                  content: editContent,
                  end_date: editEndDate, // Zaktualizowane end_date
                  categories: editCategories,
                }
              : task
          )
        );
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
      await handleDeleteTask(editTaskId);
    }
  };

  const handleSelectCategory = (category) => {
    setEditCategories([...new Set([...editCategories, category.id])]);
  };

  const handleRemoveCategory = (categoryId) => {
    setEditCategories(editCategories.filter((id) => id !== categoryId));
  };

  const getCategoriesByIds = (ids) => {
    return categories.filter((category) => ids.includes(category.id));
  };

  const handleAddTaskClick = async () => {
    try {
      const payload = {
        content: "",
        categories: [],
        end_date: "",
        trial: trial.id,
      };
      console.log("Wysyłany JSON (handleAddTaskClick):", payload);
      const response = await axios.post("/tasks/me", payload);
      console.log("Odpowiedź z API (handleAddTaskClick):", response.data);
      const newTask = response.data;
      setTasks([...tasks, newTask]);
      setEditTaskId(newTask.id);
      setEditContent(newTask.content);
      setEditEndDate(newTask.end_date);
      setEditCategories(newTask.categories);
    } catch (error) {
      console.error("Błąd podczas dodawania zadania:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      console.log("Usuwanie zadania o ID:", taskId);
      await axios.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Błąd podczas usuwania zadania:", error);
    }
  };

  const handleAddComment = (content) => {
    const newComment = {
      date: new Intl.DateTimeFormat("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
      author: "Ty",
      content,
    };
    setComments([...comments, newComment]);
  };

  if (!trial) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold">
              {trial.rank} {user.full_name} próba na stopień HO
            </h2>
            <div className="flex space-x-2">
              <button className="flex items-center bg-gray-200 p-2 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800">
                <span className="material-symbols-outlined">
                  list_alt_check
                </span>
                <span className="ml-2">Zgłoś próbę do opiekuna</span>
              </button>
              <button>
                <Link to="/edycja-proby" className="material-symbols-outlined bg-gray-200 p-2 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800">
                  edit_square
                </Link>
              </button>
              <button onClick={handleDeleteTrial}>
                <span className="material-symbols-outlined bg-red-300 p-2 rounded-lg hover:bg-red-400 dark:bg-red-700 dark:hover:bg-red-800">
                  delete
                </span>
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
              <p className="font-semibold">Stan:</p>
              <span>{trial.status}</span>
            </div>
            <div className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
              <p className="font-semibold">Data zakończenia:</p>
              <span>{getLatestEndDate(tasks)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-400">Email do kontaktu</p>
              <p className="font-medium">{trial.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email opiekuna</p>
              <p className="font-medium">{trial.mentor_mail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Data urodzenia</p>
              <p className="font-medium">{new Date(trial.birth_date).toLocaleDateString("pl-PL")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Imię i nazwisko opiekuna</p>
              <p className="font-medium">{trial.mentor_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Drużyna</p>
              <p className="font-medium">{trial.team}</p>
            </div>
          </div>

          <div className="mt-12">
          <div className="flex items-center space-x-1.5 text-xl mb-4">
            <span className="material-symbols-outlined ">task_alt</span>
            <span className="text-xl font-medium">Zadania</span>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 text-left text-sm rounded-t-2xl">
              <tr>
                <th className="p-3 rounded-tl-lg" style={{ width: "1%" }}>
                  Lp
                </th>
                <th style={{ width: "48%" }}>Treść zadania</th>
                <th style={{ width: "27%" }}>Kategoria zadania</th>
                <th style={{ width: "17%" }}>Data zakończenia</th>
                <th className="p-3 rounded-tr-lg" style={{ width: "7%" }}>
                  Edycja
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tasks.map((task, index) => {
                const taskCategories = getCategoriesByIds(
                  editTaskId === task.id ? editCategories : task.categories
                );
                return (
                  <tr key={task.id}>
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      {editTaskId === task.id ? (
                        <textarea
                          className="auto-resize-textarea border-gray-200 dark:border-gray-700"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          placeholder="Treść zadania"
                          rows={1}
                        ></textarea>
                      ) : (
                        <textarea
                          className="auto-resize-textarea border-white dark:border-gray-900"
                          value={task.content}
                          rows={1}
                          readOnly
                        ></textarea>
                      )}
                    </td>
                    <td className="pt-1 pb-3 flex flex-wrap space-x-2">
                      {taskCategories.map((category) =>
                        editTaskId === task.id ? (
                          <button
                            key={category.id}
                            className={`category-button ${category.bg_color} ${category.font_color} ${category.dark_bg_color} ${category.dark_font_color} px-3 py-1 mt-2 rounded-full text-sm w-fit flex items-center space-x-1`}
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
                            className={`${category.bg_color} ${category.font_color} ${category.dark_bg_color} ${category.dark_font_color} px-3 py-1 mt-2 rounded-full text-sm w-fit flex items-center space-x-1`}
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
                        />
                      )}
                    </td>
                    <td className="p-3">
                      {editTaskId === task.id ? (
                        <MonthDropdown
                          selectedDate={editEndDate}
                          onSelectDate={(date) => setEditEndDate(date)}
                        />
                      ) : (
                        <div className="w-full rounded-lg border border-white dark:border-gray-900 p-2 flex items-center justify-between">
                          <p>{task.end_date}</p>
                          <span className="material-symbols-outlined text-white dark:text-gray-900">
                            calendar_month
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
            onClick={handleAddTaskClick}
          >
            <span className="material-symbols-outlined mr-1">add</span>
            Nowe zadanie
          </button>
        </div>

        <CommentsSection
          comments={comments}
          onAddComment={handleAddComment}
        />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;