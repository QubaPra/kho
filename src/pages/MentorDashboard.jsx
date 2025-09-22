import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const MentorDashboard = ({ user }) => {
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
        // Ensure completion_percent exists and is numeric for sorting/filtering
        const formatted = (response.data || []).map((trial) => ({
          ...trial,
          completion_percent: (() => {
            const cp = Number(trial?.completion_percent);
            return Number.isFinite(cp) ? cp : 0;
          })(),
        }));
        setData(formatted);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setData(sortedData);
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredData = data.filter((trial) => {
    if (trial.mentor_mail !== user.login) return false;
    const q = (filter || "").toLowerCase();
    const has = (v) => String(v ?? "").toLowerCase().includes(q);
    return (
      has(trial.user) ||
      has(trial.status) ||
      has(trial.end_date) ||
      has(trial.team) ||
      has(trial.completion_percent)
    );
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow sm:p-6 p-4 mb-6 w-full flex flex-col items-left">
      <h2 className="sm:mb-12 mb-8 mt-1">
        Lista prób, których jesteś opiekunem
      </h2>
      <div className="mb-4 flex sm:max-w-md items-center">
        <input
          type="text"
          placeholder="Filtruj próby..."
          value={filter}
          onChange={handleFilterChange}
        />
        <span className="material-symbols-outlined ml-2">search</span>
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
                      <span
                        className="material-symbols-outlined !text-base">
                        north
                      </span>
                    )}
                  {sortConfig.key === "user" &&
                    sortConfig.direction === "descending" && (
                      <span
                        className="material-symbols-outlined !text-base">
                        south
                      </span>
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
                      <span
                        className="material-symbols-outlined !text-base">
                        north
                      </span>
                    )}
                  {sortConfig.key === "team" &&
                    sortConfig.direction === "descending" && (
                      <span
                        className="material-symbols-outlined !text-base">
                        south
                      </span>
                    )}
                </div>
              </th>
              <th
                className="cursor-pointer w-3/12"
                onClick={() => sortData("status")}
              >
                <div className="flex justify-between items-center">
                  <span>Stan próby</span>
                  {sortConfig.key === "status" &&
                    sortConfig.direction === "ascending" && (
                      <span
                        className="material-symbols-outlined !text-base">
                        north
                      </span>
                    )}
                  {sortConfig.key === "status" &&
                    sortConfig.direction === "descending" && (
                      <span
                        className="material-symbols-outlined !text-base">
                        south
                      </span>
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
                      <span
                        className="material-symbols-outlined !text-base">
                        north
                      </span>
                    )}
                  {sortConfig.key === "end_date" &&
                    sortConfig.direction === "descending" && (
                      <span
                        className="material-symbols-outlined !text-base">
                        south
                      </span>
                    )}
                </div>
              </th>
              <th
                className="cursor-pointer w-1/12 p-3 rounded-tr-lg"
                onClick={() => sortData("completion_percent")}
                title="Procent ukończonych zadań"
              >
                <div className="flex justify-between items-center">
                  <span>Zadania</span>
                  {sortConfig.key === "completion_percent" &&
                    sortConfig.direction === "ascending" && (
                      <span
                        className="material-symbols-outlined !text-base">
                        north
                      </span>
                    )}
                  {sortConfig.key === "completion_percent" &&
                    sortConfig.direction === "descending" && (
                      <span
                        className="material-symbols-outlined !text-base">
                        south
                      </span>
                    )}
                </div>
              </th>
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
                <td className="p-3">{formatStatus(trial.status)}</td>
                <td className="p-3">{trial.end_date}</td>
                <td className="p-3">{(Number(trial.completion_percent) || 0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorDashboard;
