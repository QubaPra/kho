import React, { useState, useEffect, useCallback } from "react";
import CategoryDropdown from "./CategoryDropdown";
import MonthDropdown from "./MonthDropdown";
import axios from "../api/axios";
import resizeTextareas from "../utils/resizeTextareas";
import { confirm } from "../components/ConfirmationModal";

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

const TasksSection = ({ trial, tasks, setTasks, setTrial, isView = false }) => {
  const [editTaskId, setEditTaskId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editCategories, setEditCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania kategorii:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    resizeTextareas();
    window.addEventListener("resize", resizeTextareas);
    return () => window.removeEventListener("resize", resizeTextareas);
  }, [editContent, editTaskId, tasks]);

  const handleEditClick = (task) => {
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
    } else if (await confirmEditApprovedTrial(trial)) {
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
      setEditTaskId(null);
    }
  };

  const handleCancelClick = async () => {
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
    setEditTaskId(null);
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
    if (!(await confirmEditApprovedTrial(trial))) {
      return;
    }
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

  const confirmEditApprovedTrial = async (trial) => {
    if (
      trial.status != "do akceptacji przez opiekuna" &&
      trial.status != "odrzucona przez kapitułę (do poprawy)" &&
      trial.status &&
      !trial.status.includes("(edytowano)")
    ) {
      if (
        !(await confirm({
          message: "Edytujesz zatwierdzoną próbę. Czy chcesz kontynuować?",
          isDanger: true,
        }))
      ) {
        return false;
      }
    }

    if (
      (trial.status && trial.status.includes("zaakceptowana przez opiekuna")) ||
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
        localStorage.setItem(
          "trial",
          JSON.stringify({ ...trial, status: "do akceptacji przez opiekuna" })
        );
      } catch (error) {
        console.error("Błąd podczas aktualizacji statusu próby:", error);
        return false;
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
        localStorage.setItem(
          "trial",
          JSON.stringify({ ...trial, status: `${trial.status} (edytowano)` })
        );
      } catch (error) {
        console.error("Błąd podczas aktualizacji statusu próby:", error);
        return false;
      }
    }

    return true;
  };

  const handleDeleteTask = async (taskId) => {
    if (!(await confirmEditApprovedTrial(trial))) {
      return;
    }
    try {
      await axios.delete(`/tasks/${taskId}`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Błąd podczas usuwania zadania:", error);
    }
  };

  const toggleTaskDone = async (task) => {
  if (isView) return; // Nie pozwalaj na zmianę w trybie podglądu
  const newValue = !task.is_done;
  try {
    await axios.patch(`/tasks/${task.id}`, { is_done: newValue });
    const updated = tasks.map(t => t.id === task.id ? { ...t, is_done: newValue } : t);
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  } catch (err) {
    console.error("Błąd podczas zmiany statusu zadania:", err);
  }
  };

  return (
    <div className="sm:mt-12 mt-8 print:mt-6">
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
              className="task flex sm:flex-row flex-col sm:space-x-2 sm:space-y-0 space-y-2"
            >
              <div className={`bg-white sm:block hidden content-center sm:w-10 w-full text-center dark:bg-gray-800 rounded-lg sm:p-4 p-2 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] ${task.is_done ? "bg-white/20 dark:bg-gray-800/20 !shadow-[0_0_15px_rgba(0,0,0,0.1)]/20 !dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]/20" : "bg-white dark:bg-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]"}`}>
                <span className={`${task.is_done ? "opacity-20" : ""}`}>{index + 1}</span>
              </div>
              <div className={`w-full rounded-lg sm:p-4 p-2  ${task.is_done ? "bg-white/20 dark:bg-gray-800/20 !shadow-[0_0_15px_rgba(0,0,0,0.1)]/20 !dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]/20" : "bg-white dark:bg-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]"}`}>
                <div className="flex justify-between items-center mb-2">
                  <span>
                    {editTaskId === task.id ? (
                      <MonthDropdown
                        selectedDate={editEndDate}
                        onSelectDate={(date) => setEditEndDate(date)}
                      />
                    ) : (
                      <div className={`w-full rounded-lg border border-white dark:border-gray-800 p-2 flex items-center space-x-1 justify-between ${task.is_done ? "opacity-20 border-white/0 dark:border-gray-800/0" : "border-white dark:border-gray-800"}`}>
                        <span className="material-symbols-outlined ">
                          calendar_month
                        </span>
                        <p className={!task.end_date ? "opacity-50" : ""}>
                          {task.end_date || "Data zakończenia"}
                        </p>
                      </div>
                    )}
                  </span>
                  {!isView && task.is_done === false ? (
                    <div className="flex space-x-2 mr-2">
                      {editTaskId === task.id ? (
                        <>
                          <button
                            className="material-symbols-outlined text-green-600 hover:text-green-800"
                            onClick={handleApproveClick}
                            title="Zatwierdź"
                          >
                            check
                          </button>
                          <button
                            className="material-symbols-outlined text-red-600 hover:text-red-800"
                            onClick={handleCancelClick}
                            title="Anuluj"
                          >
                            close
                          </button>
                        </>
                      ) : task.is_done === false ? (
                        <>
                          <button
                            className="material-symbols-outlined text-gray-400 hover:text-gray-600"
                            onClick={() => handleEditClick(task)}
                            title="Edytuj"
                          >
                            edit
                          </button>
                          <button
                            className="material-symbols-outlined text-gray-400 hover:text-red-600"
                            onClick={async () => {
                              if (
                                await confirm({
                                  message:
                                    "Czy na pewno chcesz usunąć to zadanie?",
                                  isDanger: true,
                                })
                              ) {
                                handleDeleteTask(task.id);
                              }
                            }}
                            title="Usuń"
                          >
                            delete
                          </button>
                        </>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <div>
                  {editTaskId === task.id ? (
                    <textarea
                      maxLength="1000"
                      className="auto-resize-textarea border-gray-200 dark:border-gray-700 w-full"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Treść zadania"
                      rows={1}
                    />
                  ) : (
                    <textarea
                      maxLength="1000"
                      className={`auto-resize-textarea  w-full ${task.is_done ? "opacity-20 border-white/0 dark:border-gray-800/0" : "border-white dark:border-gray-800"}`}
                      value={task.content}
                      rows={1}
                      placeholder="Treść zadania"
                      readOnly
                    />
                  )}
                </div>
                <div className="flex justify-between items-center px-2">
                  <div className={`flex flex-wrap space-x-2 ${task.is_done ? "opacity-20" : ""}`}>
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
                          <span className="category-name">{category.name}</span>
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
                  {["do akceptacji przez opiekuna", "zaakceptowana przez opiekuna", "odrzucona przez kapitułę (do poprawy)"].includes(trial.status) ? null : isView ? (
                    <span
                      className={`flex items-center space-x-2 self-end mb-2 material-symbols-outlined ${
                        task.is_done
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}                      
                    >
                      check_circle
                    </span>
                  ) : (
                    editTaskId !== task.id && (
                      <span className="flex items-center space-x-2 self-end mb-2">
                        {/* ...Twoja data... */}
                        <div
                          className={`material-symbols-outlined cursor-pointer ${
                            task.is_done
                              ? "text-green-600"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                          onClick={() => toggleTaskDone(task)}
                          title={
                            task.is_done
                              ? "Oznacz jako niewykonane"
                              : "Oznacz jako wykonane"
                          }
                          disabled={isView}
                        >
                          check_circle
                        </div>
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {isView ? null : (
          <button
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
            onClick={handleAddTaskClick}
          >
            <span className="material-symbols-outlined mr-1">add</span>
            Nowe zadanie
          </button>
        )}
      </div>
    </div>
  );
};

export default TasksSection;
