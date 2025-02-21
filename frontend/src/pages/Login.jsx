import React from "react";

function Login() {
  return (
    <div class="bg-gray-100 dark:bg-black min-h-screen">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 w-full flex flex-col items-center">
        <h2 class="text-2xl font-semibold mb-12">Zaloguj się</h2>
        <form style={{ width: "30%" }}>
          <div class="mb-4">
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"              
            />
          </div>
          <div class="mb-4">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Hasło
            </label>
            <input
              type="password"
              id="password"
              name="password"
            />
          </div>
          <button class="text-sm text-blue-600 dark:text-blue-700 mb-4 hover:underline ">Zapomniałem danych logowania</button>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white mt-2 py-2 px-4 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none "
          >
            Zaloguj się
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;
