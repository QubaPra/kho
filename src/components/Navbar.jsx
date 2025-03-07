import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ setIsAuthenticated, isAuthenticated, user }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    "theme" in localStorage ? localStorage.getItem("theme") === "dark" : false
  );

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleLogout = () => {
    // Wylogowanie użytkownika (np. usunięcie tokenu z localStorage)
    localStorage.removeItem("access_token");
    localStorage.removeItem("trial");
    localStorage.removeItem("tasks");
    setIsAuthenticated(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-sm dark:shadow-black">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="sm:text-xl text-lg font-semibold dark:text-gray-100">
            eKapituła HO
          </Link>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center space-x-6 text-center">
          {isAuthenticated && user?.role === "Administrator" && (
            <Link
              to="/uzytkownicy"
              className="sm:text-sm text-xs font-medium hover:text-blue-800 dark:hover:text-blue-600"
            >
              Użytkownicy
            </Link>
          )}
          {isAuthenticated &&
            (user?.role === "Administrator" ||
              user?.role === "Członek kapituły") && (
              <Link
                to="/proby"
                className="sm:text-sm text-xs font-medium hover:text-blue-800 dark:hover:text-blue-600"
              >
                Wszystkie próby
              </Link>
            )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="material-symbols-outlined bg-gray-800 dark:bg-gray-200 dark:text-gray-800 text-gray-100 sm:p-2 p-1.5 rounded-lg"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? "light_mode" : "dark_mode"}
          </button>
          {isAuthenticated ? (
            <>
              <Link
                to="/profil"
                className="material-symbols-outlined text-white bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 sm:p-2 p-1.5 rounded-lg"
              >
                person
              </Link>
              <button
                className="material-symbols-outlined sm:p-2 p-1.5 rounded-lg text-white bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
                onClick={handleLogout}
              >
                logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/rejestracja"
                className="flex items-center space-x-1 text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800 sm:p-2 p-1.5 rounded-lg"
              >
                <span className="material-symbols-outlined">person_add</span>
                <span>Rejestracja</span>
              </Link>
              <Link
                to="/logowanie"
                className="flex items-center space-x-1 text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 sm:p-2 p-1.5 rounded-lg"
              >
                <span className="material-symbols-outlined">login</span>
                <span>Logowanie</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
