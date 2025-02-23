import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import CommentsSection from "../components/CommentsSection";

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

const ViewTrial = ({ user }) => {
  const { id } = useParams();

  const [trial, setTrial] = useState("");
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchTrialData = async () => {
      try {
        const response = await axios.get(`/trials/${id}`);
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

  useEffect(() => {
    const textareas = document.querySelectorAll(".auto-resize-textarea");
    textareas.forEach((textarea) => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }, [tasks]);

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

  const getCategoriesByIds = (ids) => {
    return categories.filter((category) => ids.includes(category.id));
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
          <div className="flex items-center justify-between mt-1 mb-3">
            <h2 className="text-2xl font-semibold">
              {trial.rank} {user.full_name} próba na stopień HO
            </h2>
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
              <p className="font-medium">
                {new Date(trial.birth_date).toLocaleDateString("pl-PL")}
              </p>
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
                  <th style={{ width: "55%" }}>Treść zadania</th>
                  <th style={{ width: "27%" }}>Kategoria zadania</th>
                  <th className="p-3 rounded-tr-lg" style={{ width: "17%" }}>
                    Data zakończenia
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tasks.map((task, index) => {
                  const taskCategories = getCategoriesByIds(task.categories);
                  return (
                    <tr key={task.id}>
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
                        <textarea
                          className="auto-resize-textarea border-white dark:border-gray-900"
                          value={task.content}
                          rows={1}
                          readOnly
                        ></textarea>
                      </td>
                      <td className="pt-1 pb-3 flex flex-wrap space-x-2">
                        {taskCategories.map((category) => (
                          <div
                            key={category.id}
                            className={`${category.bg_color} ${category.font_color} ${category.dark_bg_color} ${category.dark_font_color} px-3 py-1 mt-2 rounded-full text-sm w-fit flex items-center space-x-1`}
                          >
                            <span className="material-symbols-outlined">
                              {category.icon}
                            </span>
                            <span>{category.name}</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-3">
                        <div className="w-full rounded-lg border border-white dark:border-gray-900 p-2 flex items-center justify-between">
                          <p>{task.end_date}</p>
                          <span className="material-symbols-outlined text-white dark:text-gray-900">
                            calendar_month
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <CommentsSection comments={comments} trialId={trial.id} />
        </div>
      </main>
    </div>
  );
};

export default ViewTrial;