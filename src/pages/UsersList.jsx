import React, { useState, useEffect } from "react";
import axios from "../api/axios";

const UsersList = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/users/");
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

  const handleRoleChange = async (index, newRole) => {
    const user = data[index];
    try {
      await axios.patch(`/users/${user.id}/`, {
        role: newRole,
      });
      const updatedData = data.map((user, i) =>
        i === index ? { ...user, role: newRole } : user
      );
      setData(updatedData);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("pl-PL", options);
  };

  const filteredData = data.filter((user) => {
    const formattedLastLogin = formatDate(user.last_login);
    const formattedDateJoined = formatDate(user.date_joined);
    return (
      user.full_name.toLowerCase().includes(filter.toLowerCase()) ||
      user.login.toLowerCase().includes(filter.toLowerCase()) ||
      user.role.toLowerCase().includes(filter.toLowerCase()) ||
      formattedLastLogin.includes(filter) ||
      formattedDateJoined.includes(filter)
    );
  });

  return (
    <div className="bg-white overflow-y-auto dark:bg-gray-900 rounded-lg shadow p-6 mb-6 w-full flex flex-col items-left">
      <h2 className="text-2xl font-semibold mb-12 mt-1">Lista użytkowników</h2>
      <div className="mb-4 sm:max-w-md flex items-center">
        <input
          type="text"
          placeholder="Filtruj użytkowników..."
          value={filter}
          onChange={handleFilterChange}
        />
        <span className="material-symbols-outlined ml-2">search</span>
      </div>
      <div className="overflow-x-auto sm:overflow-visible">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 text-left text-sm rounded-t-2xl">
            <tr>
              <th
                className="p-3 rounded-tl-lg w-1/6 cursor-pointer"
                onClick={() => sortData("full_name")}
              >
                <div className="flex justify-between items-center">
                  <span>Imię i nazwisko</span>
                  {sortConfig.key === "full_name" &&
                    sortConfig.direction === "ascending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        north
                      </span>
                    )}
                  {sortConfig.key === "full_name" &&
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
                className="w-1/6 cursor-pointer"
                onClick={() => sortData("login")}
              >
                <div className="flex justify-between items-center">
                  <span>Email</span>
                  {sortConfig.key === "login" &&
                    sortConfig.direction === "ascending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        north
                      </span>
                    )}
                  {sortConfig.key === "login" &&
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
                className="w-1/6 cursor-pointer"
                onClick={() => sortData("role")}
              >
                <div className="flex justify-between items-center">
                  <span>Funkcja</span>
                  {sortConfig.key === "role" &&
                    sortConfig.direction === "ascending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        north
                      </span>
                    )}
                  {sortConfig.key === "role" &&
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
                className="w-1/12 cursor-pointer"
                onClick={() => sortData("has_trial")}
              >
                <div className="flex justify-between items-center">
                  <span>Próba</span>
                  {sortConfig.key === "has_trial" &&
                    sortConfig.direction === "ascending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        north
                      </span>
                    )}
                  {sortConfig.key === "has_trial" &&
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
                className="w-1/12 cursor-pointer"
                onClick={() => sortData("is_mentor")}
              >
                <div className="flex justify-between items-center">
                  <span>Opiekun</span>
                  {sortConfig.key === "is_mentor" &&
                    sortConfig.direction === "ascending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        north
                      </span>
                    )}
                  {sortConfig.key === "is_mentor" &&
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
                className="w-1/6 cursor-pointer"
                onClick={() => sortData("last_login")}
              >
                <div className="flex justify-between items-center">
                  <span>Ostatnie logowanie</span>
                  {sortConfig.key === "last_login" &&
                    sortConfig.direction === "ascending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        north
                      </span>
                    )}
                  {sortConfig.key === "last_login" &&
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
                className="p-3 rounded-tr-lg w-1/6 cursor-pointer"
                onClick={() => sortData("date_joined")}
              >
                <div className="flex justify-between items-center">
                  <span>Data dołączenia</span>
                  {sortConfig.key === "date_joined" &&
                    sortConfig.direction === "ascending" && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        north
                      </span>
                    )}
                  {sortConfig.key === "date_joined" &&
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
            {filteredData.map((user, index) => (
              <tr key={user.id}>
                <td className="p-3">{user.full_name}</td>
                <td className="p-3">{user.login}</td>
                <td className="p-3">
                  <select
                    id="role"
                    value={user.role}
                    onChange={(e) => handleRoleChange(index, e.target.value)}
                  >
                    <option value="Kandydat">Kandydat</option>
                    <option value="Członek kapituły">Członek kapituły</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    className="size-5"
                    checked={user.has_trial}
                    readOnly
                  />
                </td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    className="size-5"
                    checked={user.is_mentor}
                    readOnly
                  />
                </td>
                <td className="p-3">{formatDate(user.last_login)}</td>
                <td className="p-3">{formatDate(user.date_joined)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
