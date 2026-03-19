import { useState, useEffect } from "react";
import axios from "../api/axios";
import { confirm } from "../components/ConfirmationModal";
import { Search, ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, CalendarArrowDown, CalendarArrowUp, Trash2  } from "lucide-react";

const BLOCKED_LOGINS = ["jakub.prazuch@zhr.pl"];

const UsersList = ({ currentUser }) => {
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
      let aVal = a[key];
      let bVal = b[key];
      
      // Dla kolumn z datami - sortuj chronologicznie
      if (key === "last_login" || key === "date_joined") {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }
      
      if (aVal < bVal) {
        return direction === "ascending" ? -1 : 1;
      }
      if (aVal > bVal) {
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

  const handleDeleteUser = async (user) => {
    const accepted = await confirm({
      title: "Potwierdź usunięcie",
      message: `Czy na pewno chcesz usunąć użytkownika \"${user.full_name || user.login}\"? Tej operacji nie można cofnąć.`,
      isDanger: true,
    });
    if (!accepted) return;
    try {
      await axios.delete(`/users/${user.id}/`);
      setData((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error("Error deleting user:", error);
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
    <div className="bg-white overflow-y-auto dark:bg-gray-900 rounded-lg shadow sm:p-6 p-4 mb-6 w-full flex flex-col items-left">
      <h2 className="mb-12 mt-1">Lista użytkowników</h2>
      <div className="mb-4 sm:max-w-md flex items-center">
        <input
          type="text"
          placeholder="Filtruj użytkowników..."
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
                className="p-3 rounded-tl-lg w-1/6 cursor-pointer"
                onClick={() => sortData("full_name")}
              >
                <div className="flex justify-between items-center">
                  <span>Imię i nazwisko</span>
                  {sortConfig.key === "full_name" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowDownAZ/>
                    ) : (
                      <ArrowDownZA/>
                    ))}
                </div>
              </th>
              <th className="w-1/6 cursor-pointer" onClick={() => sortData("login")}>
                <div className="flex justify-between items-center">
                  <span>Email</span>
                  {sortConfig.key === "login" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowDownAZ/>
                    ) : (
                      <ArrowDownZA/>
                    ))}
                </div>
              </th>
              <th className="w-1/6 cursor-pointer" onClick={() => sortData("role")}>
                <div className="flex justify-between items-center">
                  <span>Funkcja</span>
                  {sortConfig.key === "role" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowDownAZ/>
                    ) : (
                      <ArrowDownZA/>
                    ))}
                </div>
              </th>
              <th className="w-1/12 cursor-pointer" onClick={() => sortData("has_trial")}>
                <div className="flex justify-between items-center">
                  <span>Próba</span>
                  {sortConfig.key === "has_trial" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowDown01/>
                    ) : (
                      <ArrowDown10/>
                    ))}
                </div>
              </th>
              <th className="w-1/12 cursor-pointer" onClick={() => sortData("is_mentor")}>
                <div className="flex justify-between items-center">
                  <span>Opiekun</span>
                  {sortConfig.key === "is_mentor" &&
                    (sortConfig.direction === "ascending" ? (
                      <ArrowDown01/>
                    ) : (
                      <ArrowDown10/>
                    ))}
                </div>
              </th>
              <th className="w-1/6 cursor-pointer" onClick={() => sortData("last_login")}>
                <div className="flex justify-between items-center">
                  <span>Ostatnie logowanie</span>
                  {sortConfig.key === "last_login" &&
                    (sortConfig.direction === "ascending" ? (
                      <CalendarArrowDown/>
                    ) : (
                      <CalendarArrowUp/>
                    ))}
                </div>
              </th>
              <th className="w-1/6 cursor-pointer" onClick={() => sortData("date_joined")}>
                <div className="flex justify-between items-center">
                  <span>Data dołączenia</span>
                  {sortConfig.key === "date_joined" &&
                    (sortConfig.direction === "ascending" ? (
                      <CalendarArrowDown/>
                    ) : (
                      <CalendarArrowUp/>
                    ))}
                </div>
              </th>
              <th className="p-3 rounded-tr-lg w-1/12 text-center">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr key={user.id}>
                <td className="p-3">{user.full_name}</td>
                <td className="p-3">{user.login}</td>
                <td className="p-3 min-w-45 sm:min-w-fit">
                  <select
                    id="role"
                    value={user.role}
                    onChange={(e) => handleRoleChange(index, e.target.value)}
                    className={`w-full ${BLOCKED_LOGINS.includes(user.login) ? "opacity-50" : ""}`}
                    style={BLOCKED_LOGINS.includes(user.login) ? { cursor: "not-allowed" } : {}}
                    disabled={currentUser && currentUser.id === user.id || BLOCKED_LOGINS.includes(user.login)}
                    title={
                      currentUser && currentUser.id === user.id
                        ? "Nie możesz zmienić własnej roli"
                        : BLOCKED_LOGINS.includes(user.login)
                        ? "Zmiana roli tego użytkownika jest zablokowana"
                        : undefined
                    }
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
                <td className="p-3 text-center">
                  {!(currentUser && currentUser.id === user.id) && (
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user)}
                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      aria-label={`Usuń użytkownika ${user.full_name || user.login}`}
                      title="Usuń użytkownika"
                    >
                      <Trash2 className="text-red-600 dark:text-red-400" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
