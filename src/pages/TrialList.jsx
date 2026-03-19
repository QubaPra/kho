import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { confirm } from "../components/ConfirmationModal";
import { Search, Trash2, ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, CalendarArrowDown, CalendarArrowUp } from "lucide-react";

const TrialList = ({ user }) => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/trials/");
        const formattedData = response.data.map((trial) => ({
          ...trial,
          // Keep a plain-text version of status for filtering/sorting
          statusText: trial.status ?? "",
          // Rendered (formatted) status for display
          status: formatStatus(trial.status),
          // Ensure completion_percent exists and is a number
          completion_percent: (() => {
            const cp = Number(trial.completion_percent);
            return Number.isFinite(cp) ? cp : 0;
          })(),
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Funkcja parsująca datę zakończenia (np. "wrzesień 2025") do timestamp
  const parseEndDate = (dateStr) => {
    if (!dateStr) return 0;
    const monthMap = {
      'styczeń': 0, 'luty': 1, 'marzec': 2, 'kwiecień': 3,
      'maj': 4, 'czerwiec': 5, 'lipiec': 6, 'sierpień': 7,
      'wrzesień': 8, 'październik': 9, 'listopad': 10, 'grudzień': 11
    };
    const parts = dateStr.toLowerCase().trim().split(' ');
    if (parts.length === 2) {
      const month = monthMap[parts[0]];
      const year = parseInt(parts[1]);
      if (month !== undefined && !isNaN(year)) {
        return new Date(year, month).getTime();
      }
    }
    return 0;
  };

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    const getSortableValue = (item, k) => {
      const val = item?.[k];
      if (val === null || val === undefined) return "";
      
      // Dla daty zakończenia - parsuj do timestamp
      if (k === "end_date") {
        return parseEndDate(val);
      }
      
      // Dla completion_percent - zwróć jako liczbę
      if (k === "completion_percent") {
        return Number(val) || 0;
      }
      
      if (typeof val === "number") return val;
      // Prefer string comparison for strings/JSX
      return String(val).toLowerCase();
    };
    const sortedData = [...data].sort((a, b) => {
      const aVal = getSortableValue(a, key);
      const bVal = getSortableValue(b, key);
      if (aVal < bVal) return direction === "ascending" ? -1 : 1;
      if (aVal > bVal) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setData(sortedData);
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredData = data.filter((trial) => {
    const q = (filter ?? "").toLowerCase();
    const has = (v) => String(v ?? "").toLowerCase().includes(q);
    return (
      has(trial.user) ||
      has(trial.statusText) ||
      has(trial.end_date) ||
      has(trial.team) ||
      has(trial.mentor_name) ||
      has(trial.completion_percent)
    );
  });

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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow sm:p-6 p-4 mb-6 w-full flex flex-col items-left">
      <h2 className="sm:mb-12 mb-8 mt-1">Lista wszystkich prób</h2>
      <div className="mb-4 sm:max-w-md flex items-center">
        <input
          type="text"
          placeholder="Filtruj próby..."
          value={filter}
          onChange={handleFilterChange}
        />
        <Search className="ml-2" />
      </div>
      <div className="overflow-x-auto sm:overflow-visible">
        <table>
          <thead>
            <tr>
              <th
                className="p-3 rounded-tl-lg cursor-pointer w-2/12"
                onClick={() => sortData("user")}
              >
                <div className="flex justify-between items-center">
                  <span>Imię i nazwisko</span>
                  {sortConfig.key === "user" &&
                    sortConfig.direction === "ascending" && (
                      <ArrowDownAZ/>
                    )}
                  {sortConfig.key === "user" &&
                    sortConfig.direction === "descending" && (
                      <ArrowDownZA/>
                    )}
                </div>
              </th>
              <th
                className="cursor-pointer w-2/12"
                onClick={() => sortData("team")}
              >
                <div className="flex justify-between items-center">
                  <span>Drużyna</span>
                  {sortConfig.key === "team" &&
                    sortConfig.direction === "ascending" && (
                      <ArrowDownAZ/>
                    )}
                  {sortConfig.key === "team" &&
                    sortConfig.direction === "descending" && (
                      <ArrowDownZA/>
                    )}
                </div>
              </th>
              <th
                className="cursor-pointer w-2/12"
                onClick={() => sortData("mentor_name")}
              >
                <div className="flex justify-between items-center">
                  <span>Opiekun</span>
                  {sortConfig.key === "mentor_name" &&
                    sortConfig.direction === "ascending" && (
                      <ArrowDownAZ/>
                    )}
                  {sortConfig.key === "mentor_name" &&
                    sortConfig.direction === "descending" && (
                      <ArrowDownZA/>
                    )}
                </div>
              </th>
              <th
                className="cursor-pointer w-2/12"
                onClick={() => sortData("statusText")}
              >
                <div className="flex justify-between items-center">
                  <span>Stan próby</span>
                  {sortConfig.key === "statusText" &&
                    sortConfig.direction === "ascending" && (
                      <ArrowDownAZ/>
                    )}
                  {sortConfig.key === "statusText" &&
                    sortConfig.direction === "descending" && (
                      <ArrowDownZA/>
                    )}
                </div>
              </th>
              <th
                className="cursor-pointer w-2/12"
                onClick={() => sortData("end_date")}
              >
                <div className="flex justify-between items-center">
                  <span>Data zakończenia</span>
                  {sortConfig.key === "end_date" &&
                    sortConfig.direction === "ascending" && (
                      <CalendarArrowUp/>
                    )}
                  {sortConfig.key === "end_date" &&
                    sortConfig.direction === "descending" && (
                      <CalendarArrowDown/>
                    )}
                </div>
              </th>
              <th
                className={`cursor-pointer w-1/12 ${
                  user?.role !== "Administrator" ? "rounded-tr-lg" : ""
                }`}
                onClick={() => sortData("completion_percent")}
                title="Procent ukończonych zadań"
              >
                <div className="flex justify-between items-center">
                  <span>Zadania</span>
                  {sortConfig.key === "completion_percent" &&
                    sortConfig.direction === "ascending" && (
                      <ArrowDown01/>
                    )}
                  {sortConfig.key === "completion_percent" &&
                    sortConfig.direction === "descending" && (
                      <ArrowDown10/>
                    )}
                </div>
              </th>
              {user?.role === "Administrator" && (
                <th className="p-3 rounded-tr-lg w-1/12 text-center">Akcje</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((trial) => (
              <tr
                key={trial.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => navigate(`/proba/${trial.id}`)}
              >
                <td className="p-3">{trial.user}</td>
                <td className="p-3">{trial.team}</td>
                <td className="p-3">{trial.mentor_name}</td>
                <td className="p-3">{trial.status}</td>
                <td className="p-3">{trial.end_date ?? ""}</td>
                <td className="p-3">{(Number(trial.completion_percent) || 0)}%</td>
                {user?.role === "Administrator" && (
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const accepted = await confirm({
                          title: "Potwierdź usunięcie",
                          message: `Czy na pewno chcesz usunąć tę próbę użytkownika \"${trial.user}\"? Tej operacji nie można cofnąć.`,
                          isDanger: true,
                        });
                        if (!accepted) return;
                        try {
                          await axios.delete(`/trials/${trial.id}/`);
                          setData((prev) => prev.filter((t) => t.id !== trial.id));
                        } catch (error) {
                          console.error("Error deleting trial:", error);
                        }
                      }}
                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      aria-label={`Usuń próbę ${trial.user}`}
                      title="Usuń próbę"
                    >
                      <Trash2 className="text-red-600 dark:text-red-400" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrialList;
