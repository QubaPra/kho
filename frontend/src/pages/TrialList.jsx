import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

const TrialList = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/trials/");
        setData(response.data);
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

  const filteredData = data.filter((trial) =>
    trial.name.toLowerCase().includes(filter.toLowerCase()) ||
    trial.state.toLowerCase().includes(filter.toLowerCase()) ||
    trial.endDate.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 w-full flex flex-col items-left">
          <h2 className="text-2xl font-semibold mb-12 mt-1">Lista prób</h2>
          <div className="mb-4 flex w-1/3 items-center">
            <input
              type="text"
              placeholder="Filtruj próby..."
              value={filter}
              onChange={handleFilterChange}              
            />
            <span className="material-symbols-outlined ml-2">search</span>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 text-left text-sm rounded-t-2xl">
              <tr>
                <th
                  className="p-3 rounded-tl-lg cursor-pointer w-3/12"
                  onClick={() => sortData("name")}
                >
                  <div className="flex justify-between items-center">
                    <span>Imię i nazwisko</span>
                    {sortConfig.key === "name" &&
                      sortConfig.direction === "ascending" && (
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "1rem" }}
                        >
                          north
                        </span>
                      )}
                    {sortConfig.key === "name" &&
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
                  className=" cursor-pointer w-5/12"
                  onClick={() => sortData("state")}
                >
                  <div className="flex justify-between items-center">
                    <span>Stan próby</span>
                    {sortConfig.key === "state" &&
                      sortConfig.direction === "ascending" && (
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "1rem" }}
                        >
                          north
                        </span>
                      )}
                    {sortConfig.key === "state" &&
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
                  onClick={() => sortData("endDate")}
                >
                  <div className="flex justify-between items-center">
                    <span>Data zakończenia</span>
                    {sortConfig.key === "endDate" &&
                      sortConfig.direction === "ascending" && (
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "1rem" }}
                        >
                          north
                        </span>
                      )}
                    {sortConfig.key === "endDate" &&
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
                  className="p-3 rounded-tr-lg cursor-pointer w-1/12"
                >
                  <div className="flex justify-between items-center">
                    <span>Szczegóły</span>                    
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((trial, index) => (
                <tr key={trial.id}>
                  <td className="p-3">{trial.name}</td>
                  <td className="p-3">{trial.state}</td>
                  <td className="p-3">{trial.endDate}</td>  
                  <td className="p-3">
                    <Link to={`/proba/${trial.id}`} className="material-symbols-outlined text-blue-600 hover:text-blue-800">
                      info
                    </Link>
                  </td>                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TrialList;