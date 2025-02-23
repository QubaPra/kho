import React, { useState, useEffect } from "react";
import axios from "axios";

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
        const response = await axios.get("http://localhost:8000/api/users/");
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
      await axios.patch(`http://localhost:8000/api/users/${user.id}/`, {
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

  const filteredData = data.filter((user) =>
    user.full_name.toLowerCase().includes(filter.toLowerCase()) ||
    user.login.toLowerCase().includes(filter.toLowerCase()) ||
    user.role.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 w-full flex flex-col items-left">
          <h2 className="text-2xl font-semibold mb-12 mt-1">
            Lista użytkowników
          </h2>
          <div className="mb-4 flex w-1/3 items-center">
            <input
              type="text"
              placeholder="Filtruj użytkowników..."
              value={filter}
              onChange={handleFilterChange}
            />
            <span className="material-symbols-outlined ml-2">search</span>
          </div>
          <table className="w-1/2">
            <thead className="bg-gray-50 dark:bg-gray-700 text-left text-sm rounded-t-2xl">
              <tr>
                <th className="p-3 rounded-tl-lg w-1/3 cursor-pointer" onClick={() => sortData("full_name")}>
                  <div className="flex justify-between items-center">
                    <span>Imię i nazwisko</span>
                    {sortConfig.key === "full_name" && sortConfig.direction === "ascending" && (
                      <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                        north
                      </span>
                    )}
                    {sortConfig.key === "full_name" && sortConfig.direction === "descending" && (
                      <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                        south
                      </span>
                    )}
                  </div>
                </th>
                <th className="w-1/3 cursor-pointer" onClick={() => sortData("login")}>
                  <div className="flex justify-between items-center">
                    <span>Email</span>
                    {sortConfig.key === "login" && sortConfig.direction === "ascending" && (
                      <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                        north
                      </span>
                    )}
                    {sortConfig.key === "login" && sortConfig.direction === "descending" && (
                      <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                        south
                      </span>
                    )}
                  </div>
                </th>
                <th className="p-3 rounded-tr-lg cursor-pointer w-1/3" onClick={() => sortData("role")}>
                  <div className="flex justify-between items-center">
                    <span>Funkcja</span>
                    {sortConfig.key === "role" && sortConfig.direction === "ascending" && (
                      <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                        north
                      </span>
                    )}
                    {sortConfig.key === "role" && sortConfig.direction === "descending" && (
                      <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersList;