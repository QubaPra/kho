import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ setIsAuthenticated, isAuthenticated, user }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    "theme" in localStorage ? localStorage.getItem("theme") === "dark" : false
  );
  const location = useLocation();

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
    <>
      <header
        className={`fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 sm:shadow-sm dark:shadow-black ${( !isAuthenticated ||
          !(user?.role === "Administrator" || user?.role === "Członek kapituły")) ? "shadow-sm " : ""
        } z-40`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="sm:text-xl text-lg font-semibold dark:text-gray-100"
            >
              eKapituła HO
            </Link>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-2 sm:flex  items-center space-x-6 text-center hidden">
            {isAuthenticated && user?.role === "Administrator" && (
              <Link
                to="/uzytkownicy"
                className={`sm:text-sm text-xs font-medium hover:text-blue-800 dark:hover:text-blue-600 ${location.pathname === "/uzytkownicy" ? "!font-bold" : ""}`}
              >
                Użytkownicy
              </Link>
            )}
            {isAuthenticated &&
              (user?.role === "Administrator" ||
                user?.role === "Członek kapituły") && (
                <Link
                  to="/proby"
                  className={`sm:text-sm text-xs font-medium hover:text-blue-800 dark:hover:text-blue-600 ${location.pathname === "/proby" ? "!font-bold" : ""}`}
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
                  
                >
                  <button className="material-symbols-outlined button-save">
                  person
                  </button>
                  
                </Link>
                <button
                  className="material-symbols-outlined button-reject"
                  onClick={handleLogout}
                >
                  logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/rejestracja"
                  
                >
                  <button className="button-orange sm:space-x-1 ">
                  <span className="material-symbols-outlined">person_add</span>
                  <span className="sm:block hidden">Rejestracja</span>
                  </button>
                  
                </Link>
                <Link
                  to="/logowanie"
                >
                  <button className=" sm:space-x-1 button-blue">
                  <span className="material-symbols-outlined">login</span>
                  <span className="sm:block hidden">Logowanie</span>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <div className={`sticky top-0 pt-8 mt-6 -mb-14  mx-auto px-4 py-2 sm:hidden ${( !isAuthenticated ||
        !(user?.role === "Administrator" || user?.role === "Członek kapituły") )? "hidden" : "flex"}  items-center space-x-6 text-center justify-center bg-white dark:bg-gray-900 shadow-sm dark:shadow-black z-30`}>
        {isAuthenticated && user?.role === "Administrator" && (
          <Link
            to="/uzytkownicy"
            className={`sm:text-sm text-xs font-medium hover:text-blue-800 dark:hover:text-blue-600 ${location.pathname === "/uzytkownicy" ? "!font-bold" : ""}`}
          >
            Użytkownicy
          </Link>
        )}
        {isAuthenticated &&
          (user?.role === "Administrator" ||
            user?.role === "Członek kapituły") && (
            <Link
              to="/proby"
              className={`sm:text-sm text-xs font-medium hover:text-blue-800 dark:hover:text-blue-600 ${location.pathname === "/proby" ? "!font-bold" : ""}`}
            >
              Wszystkie próby
            </Link>
          )}
      </div>
    </>
  );
};

export default Navbar;