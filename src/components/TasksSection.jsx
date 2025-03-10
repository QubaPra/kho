import React, { useState, useEffect, useCallback } from "react";
import CategoryDropdown from "./CategoryDropdown";
import MonthDropdown from "./MonthDropdown";
import axios from "../api/axios";

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

const TasksSection = ({ trial, tasks, setTasks, isView=false}) => {
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
    const textareas = document.querySelectorAll(".auto-resize-textarea");
    textareas.forEach((textarea) => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
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

  return (
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
                  {!isView ? (
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
                  </div>): null}
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
  );
};

export default TasksSection;