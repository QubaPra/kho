import React, { useState } from "react";

function UsersList() {
  const [data, setData] = useState([
    { name: "Jan Kowalski", email: "example@gmail.com", role: "Kandydat" },
    {
      name: "Anna Nowak",
      email: "example2@gmail.com",
      role: "Członek kapituły",
    },
    {
      name: "Emil Tokarz",
      email: "example3@gmail.com",
      role: "Administrator",
    },
  ]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

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

  const handleRoleChange = (index, newRole) => {
    const updatedData = data.map((user, i) =>
      i === index ? { ...user, role: newRole } : user
    );
    setData(updatedData);
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 w-full flex flex-col items-left">
          <h2 className="text-2xl font-semibold mb-12 mt-1">
            Lista użytkowników
          </h2>

          <table className="w-1/2">
            <thead className="bg-gray-50 dark:bg-gray-700 text-left text-sm rounded-t-2xl">
              <tr>
              <th className="p-3 rounded-tl-lg w-1/3 cursor-pointer" onClick={() => sortData("name")}>
  <div
    className="flex justify-between items-center "
    
  >
    <span>Imię i nazwisko</span>
    {sortConfig.key === "name" && sortConfig.direction === "ascending" && (
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "1rem" }}
      >
        north
      </span>
    )}
    {sortConfig.key === "name" && sortConfig.direction === "descending" && (
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "1rem" }}
      >
        south
      </span>
    )}
  </div>
</th>
<th className="w-1/3 cursor-pointer" onClick={() => sortData("email")}>
  <div
    className="flex justify-between items-center"    
  >
    <span>Email</span>
    {sortConfig.key === "email" && sortConfig.direction === "ascending" && (
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "1rem" }}
      >
        north
      </span>
    )}
    {sortConfig.key === "email" && sortConfig.direction === "descending" && (
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
  className="p-3 rounded-tr-lg cursor-pointer w-1/3"
  onClick={() => sortData("role")}
>
  <div className="flex justify-between items-center">
    <span>Funkcja</span>
    {sortConfig.key === "role" && sortConfig.direction === "ascending" && (
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "1rem" }}
      >
        north
      </span>
    )}
    {sortConfig.key === "role" && sortConfig.direction === "descending" && (
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
              {data.map((user, index) => (
                <tr key={index}>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
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