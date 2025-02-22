import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ setIsAuthenticated, isAuthenticated, user }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    } else {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark;
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Wylogowanie użytkownika (np. usunięcie tokenu z localStorage)
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-xl font-semibold dark:text-gray-100">
            eKapituła HKK
          </Link>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center space-x-6">
          {isAuthenticated && user?.role === "Administrator" && (
            <Link to="/uzytkownicy" className="text-sm font-medium hover:text-blue-800 dark:hover:text-blue-600">
              Użytkownicy
            </Link>
          )}
          {isAuthenticated && (user?.role === "Administrator" || user?.role === "Członek kapituły") && (
            <Link to="/proby" className="text-sm font-medium hover:text-blue-800 dark:hover:text-blue-600">
              Wszystkie próby
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="material-symbols-outlined bg-gray-800 dark:bg-gray-200 dark:text-gray-800 text-gray-100 p-2 rounded-lg"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? "light_mode" : "dark_mode"}
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/profil" className="material-symbols-outlined text-white bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 p-2 rounded-lg">
                person
              </Link>
              <button
                className="material-symbols-outlined p-2 rounded-lg text-white bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
                onClick={handleLogout}
              >
                logout
              </button>
            </>
          ) : (
            <>
              <Link to="/rejestracja" className="flex items-center space-x-1 text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800 p-2 rounded-lg">
                <span className="material-symbols-outlined">person_add</span>
                <span>Rejestracja</span>
              </Link>
              <Link to="/logowanie" className="flex items-center space-x-1 text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 p-2 rounded-lg">
                <span className="material-symbols-outlined">login</span>
                <span>Logowanie</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;