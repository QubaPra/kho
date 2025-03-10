import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import CommentsSection from "../components/CommentsSection";
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

const ViewTrial = ({ user, id: propId }) => {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const navigate = useNavigate();

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

  const handleLeaveTrial = async () => {
    const confirmed = window.confirm(
      "Czy na pewno chcesz przestać być opiekunem tej próby?"
    );
    if (!confirmed) return;

    try {
      await axios.patch(`/trials/${id}`, {
        mentor_mail: "",
        mentor_name: "",
      });
      navigate("/");
    } catch (error) {
      console.error("Błąd podczas porzucania próby:", error);
    }
  };

  const handleApproveTrialMentor = async () => {
    const confirmed = window.confirm(
      "Czy na pewno chcesz zatwierdzić tę próbę jako opiekun?"
    );
    if (!confirmed) return;
    try {
      await axios.patch(`/trials/${id}`, {
        status: "zaakceptowana przez opiekuna",
      });
      setTrial((prevTrial) => ({
        ...prevTrial,
        status: "zaakceptowana przez opiekuna",
      }));
    } catch (error) {
      console.error("Błąd podczas zatwierdzania próby:", error);
    }
  };

  const handleApproveTrialCommittee = async () => {
    const confirmed = window.confirm(
      "Czy na pewno chcesz zaakceptować tę próbę jako kapituła (do otwarcia)?"
    );
    if (!confirmed) return;
    try {
      await axios.patch(`/trials/${id}`, {
        status: "zaakceptowana przez kapitułę (do otwarcia)",
      });
      setTrial((prevTrial) => ({
        ...prevTrial,
        status: "zaakceptowana przez kapitułę (do otwarcia)",
      }));
    } catch (error) {
      console.error("Błąd podczas zatwierdzania próby przez komisję:", error);
    }
  };

  const handleRejectTrialCommittee = async () => {
    const confirmed = window.confirm(
      "Czy na pewno chcesz odrzucić tę próbę jako kapituła?"
    );
    if (!confirmed) return;
    try {
      await axios.patch(`/trials/${id}`, {
        status: "odrzucona przez kapitułę (do poprawy)",
      });
      setTrial((prevTrial) => ({
        ...prevTrial,
        status: "odrzucona przez kapitułę (do poprawy)",
      }));
    } catch (error) {
      console.error("Błąd podczas odrzucania próby przez komisję:", error);
    }
  };

  const handleOpenTrial = async () => {
    const confirmed = window.confirm(
      "Czy na pewno chcesz zmienić status próby na otwarta?"
    );
    if (!confirmed) return;
    try {
      const orderNumber = prompt("Podaj numer rozkazu:");
      const orderLink = prompt("Podaj link do PDF rozkazu:");

      if (!orderNumber || !orderLink) {
        alert("Numer rozkazu i link do PDF rozkazu są wymagane.");
        return;
      }

      let newStatus = `Otwarta rozkazem ${orderNumber} <${orderLink}>`;
      if (trial.status && trial.status.includes("(edytowano)")) {
        newStatus += " (edytowano)";
      }

      await axios.patch(`/trials/${id}`, {
        status: newStatus,
      });

      setTrial((prevTrial) => ({
        ...prevTrial,
        status: newStatus,
      }));
    } catch (error) {
      console.error("Błąd podczas otwierania próby:", error);
    }
  };

  const handleEndTrialCommittee = async () => {
    const confirmed = window.confirm(
      "Czy na pewno chcesz zaakceptować tę próbę jako kapituła (do zamknięcia)?"
    );
    if (!confirmed) return;
    try {
      await axios.patch(`/trials/${id}`, {
        status: "zatwierdzona przez kapitułę (do zamknięcia)",
      });
      setTrial((prevTrial) => ({
        ...prevTrial,
        status: "zatwierdzona przez kapitułę (do zamknięcia)",
      }));
    } catch (error) {
      console.error("Błąd podczas zatwierdzania próby przez komisję:", error);
    }
  };

  const handleEndTrial = async () => {
    const confirmed = window.confirm(
      "Czy na pewno chcesz zmienić status próby na zamknięta?"
    );
    if (!confirmed) return;
    try {
      const orderNumber = prompt("Podaj numer rozkazu:");
      const orderLink = prompt("Podaj link do PDF rozkazu:");

      if (!orderNumber || !orderLink) {
        alert("Numer rozkazu i link do PDF rozkazu są wymagane.");
        return;
      }

      await axios.patch(`/trials/${id}`, {
        status: `Zamknięta rozkazem ${orderNumber} <${orderLink}>`,
      });

      setTrial((prevTrial) => ({
        ...prevTrial,
        status: `Zamknięta rozkazem ${orderNumber} <${orderLink}>`,
      }));
    } catch (error) {
      console.error("Błąd podczas zamykania próby:", error);
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow sm:p-6 p-4 mb-6">
      <div className="sm:flex items-center justify-between mb-2">
        <h2>
          {trial.rank} {trial.user} próba na stopień HO
        </h2>
        <div className="flex space-x-2 sm:my-0 mb-2 mt-2">
        {trial.report && user.login===trial.mentor_mail && !trial.status?.includes("Zamknięta")? (
            <button className="button-approve" onClick={() => window.open(trial.report, '_blank')}>
              <span className="material-symbols-outlined">Summarize</span>
              <span className="ml-2">Zobacz raport</span>
            </button>
          ) : (trial.report) && <button className="button-approve" onClick={() => window.open(trial.report+"/preview", '_blank')}>
          <span className="material-symbols-outlined">Summarize</span>
          <span className="ml-2">Zobacz raport</span>
        </button>}
          {user.login===trial.mentor_mail &&
          (trial.status == "do akceptacji przez opiekuna" ||
            trial.status == "odrzucona przez kapitułę (do poprawy)") ? (
            <>
              <button
                onClick={handleApproveTrialMentor}
                className="flex items-center bg-gray-200 sm:p-2 p-1.5 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800"
              >
                <span className="material-symbols-outlined">
                  list_alt_check
                </span>
                <span className="ml-2">Zatwierdź próbę</span>
              </button>

              <button
                onClick={handleLeaveTrial}
                className="button-reject"
              >
                <span className="material-symbols-outlined">delete</span>
                <span className="ml-2">Porzuć próbę</span>
              </button>
            </>
          ) : trial.status == "zaakceptowana przez opiekuna" &&
            user.role == "Administrator" ? (
            <>
              <button
                onClick={handleApproveTrialCommittee}
                className="button-approve"
              >
                <span className="material-symbols-outlined">
                  list_alt_check
                </span>
                <span className="ml-2">Zatwierdź próbę (do otwarcia)</span>
              </button>

              <button
                onClick={handleRejectTrialCommittee}
                className="button-reject"
              >
                <span className="material-symbols-outlined">cancel</span>
                <span className="ml-2">Odrzuć próbę (do poprawy)</span>
              </button>
            </>
          ) : user.role == "Administrator" &&
            trial.status &&
            trial.status.includes("Otwarta") ? (

              <button
                    onClick={handleEndTrialCommittee}
                    className="button-approve"
                  >
                      <span className="material-symbols-outlined">
                        assignment_turned_in
                      </span>
                      <span className="ml-2">Zatwierdź próbę (do zamknięcia)</span>
                    </button>
          ) : (user.role == "Członek kapituły" ||
              user.role == "Administrator") &&
            trial.status == "zatwierdzona przez kapitułę (do zamknięcia)" ? (
            <button
              onClick={handleEndTrial}
              className="button-approve"
            >
              <span className="material-symbols-outlined">
                assignment_turned_in
              </span>
              <span className="ml-2">Zmień status na zamknięta</span>
            </button>
          ) : (user.role == "Członek kapituły" ||
              user.role == "Administrator") &&
            trial.status &&
            trial.status.includes("(do otwarcia)") ? (
            <button
              onClick={handleOpenTrial}
              className="button-approve"
            >
              <span className="material-symbols-outlined">
                assignment_turned_in
              </span>
              <span className="ml-2">Zmień status na otwarta</span>
            </button>
          ) : null}
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
          <p className="sm:text-sm text-xs text-gray-400">Imię i nazwisko opiekuna</p>
          <p className="font-medium">{trial.mentor_name}</p>
        </div>
      </div>

      <TasksSection trial={trial} tasks={tasks} setTasks={setTasks} isView={true} />

      <CommentsSection
        comments={comments}
        trialId={trial.id}
        status={trial.status || ""}
      />
    </div>
  );
};

export default ViewTrial;
