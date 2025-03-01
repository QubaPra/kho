import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const TrialList = () => {
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
          status: formatStatus(trial.status),
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

  const filteredData = data.filter(
    (trial) =>
      trial.user.toLowerCase().includes(filter.toLowerCase()) ||
      trial.status.toLowerCase().includes(filter.toLowerCase()) ||
      trial.end_date.toLowerCase().includes(filter.toLowerCase()) ||
      trial.team.toLowerCase().includes(filter.toLowerCase()) ||
      trial.mentor_name.toLowerCase().includes(filter.toLowerCase())
  );

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
      <h2 className="sm:mb-12 mb-8 mt-1">Lista prób</h2>
      <div className="mb-4 sm:max-w-md flex items-center">
        <input
          type="text"
          placeholder="Filtruj próby..."
          value={filter}
          onChange={handleFilterChange}
        />
        <span className="material-symbols-outlined ml-2">search</span>
      </div>
      <div className="overflow-x-auto sm:overflow-visible">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 text-left sm:text-sm text-xs rounded-t-2xl">
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
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        north
                      </span>
                    )}
                  {sortConfig.key === "user" &&
                    sortConfig.direction === "descending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
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
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        north
                      </span>
                    )}
                  {sortConfig.key === "team" &&
                    sortConfig.direction === "descending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        south
                      </span>
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
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        north
                      </span>
                    )}
                  {sortConfig.key === "mentor_name" &&
                    sortConfig.direction === "descending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
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
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        north
                      </span>
                    )}
                  {sortConfig.key === "status" &&
                    sortConfig.direction === "descending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        south
                      </span>
                    )}
                </div>
              </th>
              <th
                className="cursor-pointer w-2/12 rounded-tr-lg"
                onClick={() => sortData("end_date")}
              >
                <div className="flex justify-between items-center">
                  <span>Data zakończenia</span>
                  {sortConfig.key === "end_date" &&
                    sortConfig.direction === "ascending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        north
                      </span>
                    )}
                  {sortConfig.key === "end_date" &&
                    sortConfig.direction === "descending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        south
                      </span>
                    )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.map((trial, index) => (
              <tr
                key={trial.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => navigate(`/proba/${trial.id}`)}
              >
                <td className="p-3">{trial.user}</td>
                <td className="p-3">{trial.team}</td>
                <td className="p-3">{trial.mentor_name}</td>
                <td className="p-3">{trial.status}</td>
                <td className="p-3">{trial.end_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrialList;
