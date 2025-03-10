import { useState, useEffect, useCallback } from "react";
import CommentsSection from "../components/CommentsSection";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import ViewTrial from "./ViewTrial";
import TasksSection from "../components/TasksSection";

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

    fetchTrialData();
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

      <TasksSection trial={trial} tasks={tasks} setTasks={setTasks} />

      <CommentsSection
        comments={comments}
        trialId={trial.id}
        status={trial.status || ""}
      />
    </div>
  );
};

export default Dashboard;
