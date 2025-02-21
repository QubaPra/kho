import { useState, useEffect } from "react";
import categories from "../assets/categories";
import CategoryDropdown from "../components/CategoryDropdown";
import CommentsSection from "../components/CommentsSection";
import MonthDropdown from "../components/MonthDropdown";
import { Link } from "react-router-dom";

function Dashboard() {
  function getLatestEndDate(tasks) {
    if (tasks.length === 0) return "";
    const dates = tasks
      .map((task) => new Date(task.endDate))
      .filter((date) => !isNaN(date));
    if (dates.length === 0) return "";
    const latestDate = new Date(Math.max(...dates));
    return latestDate.toLocaleDateString("pl-PL", {
      month: "long",
      year: "numeric",
    });
  }

  const [tasks, setTasks] = useState([
    {
      id: 1,
      content:
        "Będę regularnie uczył się muzyki aby osiągnąć wynik 12% na egzaminie maturalnym",
      categories: [],
      endDate: "marzec 2026",
    },
    {
      id: 2,
      content:
        "Nie będę nic robić regularnie przez najbliższe 2 miesiące żeby ćwiczyć technikę “nionierobienia”",
      categories: [2, 6, 7, 8, 10, 12, 11],
      endDate: "październik 2025",
    },
  ]);

  const [comments, setComments] = useState([
    {
      date: "23 lipca 2024",
      author: "Andrzej Żarnowski",
      content: "Jak dla mnie jest w porządku! :)",
    },
  ]);

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
    setEditEndDate(task.endDate);
    setEditCategories(task.categories);
  };

  const handleApproveClick = () => {
    if (
      editContent.trim() === "" &&
      editEndDate.trim() === "" &&
      editCategories.length === 0
    ) {
      setTasks(tasks.filter((task) => task.id !== editTaskId));
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === editTaskId
            ? {
                ...task,
                content: editContent,
                endDate: editEndDate,
                categories: editCategories,
              }
            : task
        )
      );
    }
    setEditTaskId(null);
  };

  const handleCancelClick = () => {
    const task = tasks.find((task) => task.id === editTaskId);
    if (
      task &&
      task.content.trim() === "" &&
      task.endDate.trim() === "" &&
      task.categories.length === 0
    ) {
      setTasks(tasks.filter((task) => task.id !== editTaskId));
    }
    setEditTaskId(null);
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

  function handleAddTaskClick() {
    const newTask = {
      id: tasks.length + 1,
      content: "",
      categories: [],
      endDate: "",
    };
    setTasks([...tasks, newTask]);
    setEditTaskId(newTask.id);
    setEditContent(newTask.content);
    setEditEndDate(newTask.endDate);
    setEditCategories(newTask.categories);
  }

  const handleDeleteClick = (taskId) => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć to zadanie?");
    if (confirmed) {
      setTasks(tasks.filter((task) => task.id !== taskId));
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

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold">
              wyw. Jakub Prażuch próba na stopień HO
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
              <button>
                <span className="material-symbols-outlined bg-red-300 p-2 rounded-lg hover:bg-red-400 dark:bg-red-700 dark:hover:bg-red-800">
                  delete
                </span>
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
              <p className="font-semibold">Stan:</p>
              <span>do akceptacji przez opiekuna</span>
            </div>
            <div className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm w-fit flex items-center space-x-1">
              <p className="font-semibold">Data zakończenia:</p>
              <span>{getLatestEndDate(tasks)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-400">Email do kontaktu</p>
              <p className="font-medium">jakub.prazuch@malopolska.zhr.pl</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email opiekuna</p>
              <p className="font-medium">andrzej.zarnowski@malopolska.zhr.pl</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Data urodzenia</p>
              <p className="font-medium">25 lipca 2005</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Imię i nazwisko opiekuna</p>
              <p className="font-medium">Andrzej Żarnowski</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Drużyna</p>
              <p className="font-medium">40 KDH Barykada</p>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex items-center space-x-1.5 text-xl mb-4">
              <span className="material-symbols-outlined ">task_alt</span>
              <span className="text-xl font-medium">Zadania</span>
            </div>

            <table className="w-full">
              <thead className="bg-green-50 dark:bg-gray-700 text-left text-sm rounded-t-2xl">
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
                              className={`category-button ${category.bgColor} ${category.fontColor} ${category.darkBgColor} ${category.darkFontColor} px-3 py-1 mt-2 rounded-full text-sm w-fit flex items-center space-x-1`}
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
                              className={`${category.bgColor} ${category.fontColor} ${category.darkBgColor} ${category.darkFontColor} px-3 py-1 mt-2 rounded-full text-sm w-fit flex items-center space-x-1`}
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
                            <p>{task.endDate}</p>
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
                              onClick={() => handleDeleteClick(task.id)}
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
