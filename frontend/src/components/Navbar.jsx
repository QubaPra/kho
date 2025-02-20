import React, { useState, useEffect } from "react";

function Navbar() {
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


  return (
    <header class="bg-white dark:bg-gray-900 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <button class="text-xl font-semibold dark:text-gray-100">
            eKapituła HKK
          </button>
        </div>
        <div class="max-w-7xl mx-auto px-4 py-2 flex items-center space-x-6">
          <button class="text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300">
            Użytkownicy
          </button>
          <button class="text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300">
            Wszystkie próby
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <button
            class="material-symbols-outlined bg-gray-800 dark:bg-gray-200 dark:text-gray-800 text-gray-100 p-2 rounded-lg"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? "light_mode" : "dark_mode"}
          </button>
          <button class="material-symbols-outlined dark:text-white bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 p-2 rounded-lg">
            person
          </button>
          <button class="material-symbols-outlined p-2 rounded-lg dark:text-white bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800">
            logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;