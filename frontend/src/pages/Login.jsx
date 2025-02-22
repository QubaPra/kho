import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/"); // Przekierowanie na stronę główną, jeśli użytkownik jest zalogowany
    }
  }, [navigate]);

  useEffect(() => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const handleKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault();
      }
    };

    emailInput.addEventListener("keydown", handleKeyDown);
    passwordInput.addEventListener("keydown", handleKeyDown);

    return () => {
      emailInput.removeEventListener("keydown", handleKeyDown);
      passwordInput.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: email, password }),
      });

      if (!response.ok) {
        throw new Error('Nieprawidłowe dane logowania');
      }

      const data = await response.json();

      // Zapisujemy token w localStorage
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // Ustawiamy stan logowania w App.jsx
      setIsAuthenticated(true);

      // Przekierowujemy na Dashboard
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 w-full flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-12 mt-1">Zaloguj się</h2>
          <form style={{ width: "30%" }} onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Hasło
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button className="text-sm text-blue-600 dark:text-blue-700 mb-4 hover:underline ">
              Zapomniałem danych logowania
            </button>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white mt-2 py-2 px-4 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none "
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