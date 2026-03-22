import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import CommentsSection from "../components/CommentsSection";
import TasksSection from "../components/TasksSection";
import { confirm } from "../components/ConfirmationModal";
import { monthMap, formatStatus, getAgeSuffix, getLatestEndDate } from "../utils/formatters";
import { FileText, ListCheck, UserX, Undo2, CheckCheck } from "lucide-react";

const ViewTrial = ({ user, id: propId }) => {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const navigate = useNavigate();

  const [trial, setTrial] = useState("");
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);

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

    fetchTrialData();
  }, []);

  const handleLeaveTrial = async () => {
    const result = await confirm({
      message: "Czy na pewno chcesz przestać być opiekunem tej próby?",
      isDanger: true,
    });
    if (!result) return;

    try {
      await axios.patch(`/trials/${id}`, {
        mentor_mail: "",
        mentor_name: "",
      });
      navigate("/");
    } catch (error) {
      console.error("Błąd podczas porzucania próby:", error);
    }
    try {
      await axios.post(`/emails`, {
        function: "leave_trial_mentor",
        trial_id: trial.id,
      });
    } catch (error) {
      console.error("Błąd podczas wysyłania maila:", error);
    }
  };

  const handleApproveTrialMentor = async () => {
    const result = await confirm({
      message: "Czy na pewno chcesz zatwierdzić tę próbę jako opiekun?",
      isDanger: true,
    });
    if (!result) return;
    try {
      await axios.patch(`/trials/${id}`, {
        status: "zaakceptowana przez opiekuna",
      });
      setTrial((prevTrial) => ({
        ...prevTrial,
        status: "zaakceptowana przez opiekuna",
      }));
      localStorage.setItem(
        "trial",
        JSON.stringify({ ...trial, status: "zaakceptowana przez opiekuna" })
      );
    } catch (error) {
      console.error("Błąd podczas zatwierdzania próby:", error);
    }
    try {
      await axios.post(`/emails`, {
        function: "approve_trial_mentor",
        trial_id: trial.id,
      });
    } catch (error) {
      console.error("Błąd podczas wysyłania maila:", error);
    }
  };

  const handleApproveTrialCommittee = async () => {
    const result = await confirm({
      message:
        "Czy na pewno chcesz zaakceptować tę próbę jako kapituła (do otwarcia)?",
    });
    if (!result) return;

    try {
      await axios.patch(`/trials/${id}`, {
        status: "zaakceptowana przez kapitułę (do otwarcia)",
      });
      setTrial((prevTrial) => ({
        ...prevTrial,
        status: "zaakceptowana przez kapitułę (do otwarcia)",
      }));
      localStorage.setItem(
        "trial",
        JSON.stringify({
          ...trial,
          status: "zaakceptowana przez kapitułę (do otwarcia)",
        })
      );
    } catch (error) {
      console.error("Błąd podczas zatwierdzania próby przez komisję:", error);
    }
    try {
      await axios.post(`/emails`, {
        function: "approve_trial_open",
        trial_id: trial.id,
      });
    } catch (error) {
      console.error("Błąd podczas wysyłania maila:", error);
    }

  };

  const handleRejectTrialCommittee = async () => {
    const result = await confirm({
      message: "Czy na pewno chcesz odrzucić tę próbę jako kapituła?",
      isDanger: true,
    });
    if (!result) return;

    try {
      await axios.patch(`/trials/${id}`, {
        status: "odrzucona przez kapitułę (do poprawy)",
      });
      setTrial((prevTrial) => ({
        ...prevTrial,
        status: "odrzucona przez kapitułę (do poprawy)",
      }));
      localStorage.setItem(
        "trial",
        JSON.stringify({
          ...trial,
          status: "odrzucona przez kapitułę (do poprawy)",
        })
      );
    } catch (error) {
      console.error("Błąd podczas odrzucania próby przez komisję:", error);
    }
    try {
      await axios.post(`/emails`, {
        function: "reject_trial",
        trial_id: trial.id,
      });
    } catch (error) {
      console.error("Błąd podczas wysyłania maila:", error);
    }
  };

  const handleOpenTrial = async () => {
    const result = await confirm({
      message: "Czy na pewno chcesz zmienić status próby na otwarta?",
    });
    if (!result) return;

    try {
      const orderNumber = prompt("Podaj numer rozkazu:");
      const orderLink = prompt("Podaj link do PDF rozkazu:");

      if (!orderNumber || !orderLink) {
        confirm({
                title: "Błąd!",
                message: "Numer rozkazu i link do PDF rozkazu są wymagane.",
                isAlert: true,
              });
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
      localStorage.setItem(
        "trial",
        JSON.stringify({ ...trial, status: newStatus })
      );
    } catch (error) {
      console.error("Błąd podczas otwierania próby:", error);
    }
    try {
      await axios.post(`/emails`, {
        function: "open_trial",
        trial_id: trial.id,
      });
    } catch (error) {
      console.error("Błąd podczas wysyłania maila:", error);
    }
  };

  const handleEndTrialCommittee = async () => {
    const result = await confirm({
      message:
        "Czy na pewno chcesz zaakceptować tę próbę jako kapituła (do zamknięcia)?",
    });
    if (!result) return;

    try {
      await axios.patch(`/trials/${id}`, {
        status: "zatwierdzona przez kapitułę (do zamknięcia)",
      });
      setTrial((prevTrial) => ({
        ...prevTrial,
        status: "zatwierdzona przez kapitułę (do zamknięcia)",
      }));
      localStorage.setItem(
        "trial",
        JSON.stringify({
          ...trial,
          status: "zatwierdzona przez kapitułę (do zamknięcia)",
        })
      );
    } catch (error) {
      console.error("Błąd podczas zatwierdzania próby przez komisję:", error);
    }
    try {
      await axios.post(`/emails`, {
        function: "approve_trial_close",
        trial_id: trial.id,
      });
    } catch (error) {
      console.error("Błąd podczas wysyłania maila:", error);
    }
  };

  const handleEndTrial = async () => {
    const result = await confirm({
      message: "Czy na pewno chcesz zmienić status próby na zamknięta?",
    });
    if (!result) return;

    try {
      const orderNumber = prompt("Podaj numer rozkazu:");
      const orderLink = prompt("Podaj link do PDF rozkazu:");

      if (!orderNumber || !orderLink) {
        confirm({
                title: "Błąd!",
                message: "Numer rozkazu i link do PDF rozkazu są wymagane.",
                isAlert: true,
              });
        return;
      }

      await axios.patch(`/trials/${id}`, {
        status: `Zamknięta rozkazem ${orderNumber} <${orderLink}>`,
      });

      setTrial((prevTrial) => ({
        ...prevTrial,
        status: `Zamknięta rozkazem ${orderNumber} <${orderLink}>`,
      }));
      localStorage.setItem(
        "trial",
        JSON.stringify({
          ...trial,
          status: `Zamknięta rozkazem ${orderNumber} <${orderLink}>`,
        })
      );
    } catch (error) {
      console.error("Błąd podczas zamykania próby:", error);
    }
    try {
      await axios.post(`/emails`, {
        function: "close_trial",
        trial_id: trial.id,
      });
    } catch (error) {
      console.error("Błąd podczas wysyłania maila:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow sm:p-6 p-4 mb-6">
      <div className="sm:flex items-center justify-between mb-2">
        <h2>
          {trial.rank} {trial.user} próba na stopień {trial.trial_rank}
        </h2>
        <div className="flex space-x-2 sm:my-0 mb-2 mt-2 md:min-w-fit md:ml-4">
          {trial.report &&
          user.login === trial.mentor_mail &&
          !trial.status?.includes("Zamknięta") ? (
            <button
              className="button-approve"
              onClick={() => window.open(trial.report, "_blank")}
            >
              <FileText/>
              <span className="ml-2">Zobacz raport</span>
            </button>
          ) : (
            trial.report && (
              <button
                className="button-approve"
                onClick={() => window.open(trial.report + "/preview", "_blank")}
              >
                <FileText/>
                <span className="ml-2">Zobacz raport</span>
              </button>
            )
          )}
          {user.login === trial.mentor_mail &&
          (trial.status == "do akceptacji przez opiekuna" ||
            trial.status == "odrzucona przez kapitułę (do poprawy)") ? (
            <>
              <button
                onClick={handleApproveTrialMentor}
                className="flex items-center button-approve"
              >
                <ListCheck/>
                <span className="ml-2">Zatwierdź próbę</span>
              </button>

              <button onClick={handleLeaveTrial} className="button-reject">
                <UserX/>
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
                <ListCheck/>
                <span className="ml-2">Zatwierdź próbę (do otwarcia)</span>
              </button>

              <button
                onClick={handleRejectTrialCommittee}
                className="button-reject"
              >
                <Undo2/>
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
              <CheckCheck/>
              <span className="ml-2">Zatwierdź próbę (do zamknięcia)</span>
            </button>
          ) : (user.role == "Członek kapituły" ||
              user.role == "Administrator") &&
            trial.status == "zatwierdzona przez kapitułę (do zamknięcia)" ? (
            <button onClick={handleEndTrial} className="button-approve">
              <CheckCheck/>
              <span className="ml-2">Zmień status na zamknięta</span>
            </button>
          ) : (user.role == "Członek kapituły" ||
              user.role == "Administrator") &&
            trial.status &&
            trial.status.includes("(do otwarcia)") ? (
            <button onClick={handleOpenTrial} className="button-approve">
              <CheckCheck/>
              <span className="ml-2">Zmień status na otwarta</span>
            </button>
          ) : (
            <div className="sm:py-5"></div>
          )}
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

      <TasksSection
        trial={trial}
        tasks={tasks}
        setTrial={setTrial}
        setTasks={setTasks}
        isView={true}
      />

      <CommentsSection
        comments={comments}
        trialId={trial.id}
        status={trial.status || ""}
      />
    </div>
  );
};

export default ViewTrial;
