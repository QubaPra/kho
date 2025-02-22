import React, { useState, useEffect } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Przykładowe dane
  const exampleData = {
    email: "example@example.com",
    name: "Jan Kowalski",
    password: "examplePassword"
  };

  useEffect(() => {
    // Uzupełnianie inputów przykładowymi danymi przy ładowaniu strony
    setEmail(exampleData.email);
    setName(exampleData.name);
    setPassword(exampleData.password);
  }, []);

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

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-ZÀ-Ž][a-zà-ž]+(?:[-\s][A-ZÀ-Ž][a-zà-ž]+)+$/;

    if (!email) {
      newErrors.email = "Email jest wymagany";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email jest nieprawidłowy";
    } else if (email.length > 100) {
      newErrors.email = "Email nie może być dłuższy niż 100 znaków";
    }

    if (!name) {
      newErrors.name = "Imię i nazwisko są wymagane";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Imię i nazwisko są nieprawidłowe";
    } else if (name.length > 100) {
      newErrors.name = "Imię i nazwisko nie mogą być dłuższe niż 100 znaków";
    }

    if (!password) {
      newErrors.password = "Hasło jest wymagane";
    } else if (password.length < 4) {
      newErrors.password = "Hasło musi mieć minimum 4 znaki";
    } else if (/\s/.test(password)) {
      newErrors.password = "Hasło nie może zawierać spacji";
    } else if (password.length > 100) {
      newErrors.password = "Hasło nie może być dłuższe niż 100 znaków";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value.replace(/\s/g, ""); // Usuwa spacje
    setPassword(value);
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    setIsCapsLockOn(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (validate()) {
      // Submit form
      console.log("Form submitted");
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 w-full flex flex-col items-left">
          <h2 className="text-2xl font-semibold mb-12 mt-1">Twoje dane</h2>
          <div style={{ width: "30%" }}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email (login)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                disabled={!isEditing}
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-600 text-sm">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Imię i nazwisko
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleNameChange}
                disabled={!isEditing}
              />
              {errors.name && (
                <p className="text-red-500 dark:text-red-600 text-sm">
                  {errors.name}
                </p>
              )}
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
                disabled={!isEditing}
              />
              {errors.password && (
                <p className="text-red-500 dark:text-red-600 text-sm">
                  {errors.password}
                </p>
              )}
              {isCapsLockOn && (
                <p className="text-yellow-500 dark:text-yellow-600 text-sm">
                  Capslock jest włączony
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleSaveClick}
                  className="w-full bg-green-600 text-white mt-2 py-2 px-4 flex justify-center space-x-1 rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none"
                  >
                  <span className="material-symbols-outlined">
                  check
                </span>
                <span>Zapisz</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="w-full bg-blue-600 text-white mt-2 py-2 px-4 flex justify-center space-x-1 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none"
                >
                  <span className="material-symbols-outlined">
                  edit_square
                </span>
                <span>Edytuj</span>
                  
                </button>
              )}
              <button
                type="button"
                className="w-full text-white mt-2 py-2 px-4 rounded-lg flex justify-center space-x-1 bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none"
                >
                <span className="material-symbols-outlined">
                delete
              </span>
              <span>Usuń konto</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;