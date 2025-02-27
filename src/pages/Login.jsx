import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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
      const response = await axios.post("/login/", {
        login: email,
        password: password,
      });
  
      const data = response.data;
  
      // Zapisujemy token w localStorage
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
  
      // Ustawiamy stan logowania w App.jsx
      setIsAuthenticated(true);
  
      // Przekierowujemy na Dashboard
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Nieprawidłowe dane logowania');
    }
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };
  
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    setIsCapsLockOn(false);
  };

  useEffect(() => {
    const handleCapsLock = (e) => {
      if (isPasswordFocused) {
        setIsCapsLockOn(e.getModifierState("CapsLock"));
      }
    };
  
    window.addEventListener("keydown", handleCapsLock);
    window.addEventListener("keyup", handleCapsLock);
  
    return () => {
      window.removeEventListener("keydown", handleCapsLock);
      window.removeEventListener("keyup", handleCapsLock);
    };
  }, [isPasswordFocused]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 w-full flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-12 mt-1">Zaloguj się</h2>
          <form className="px-6 w-sm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
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
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
              />
              {isCapsLockOn && (
                <p className="text-yellow-500 dark:text-yellow-600 text-sm">
                  CapsLock jest włączony
                </p>
              )}
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