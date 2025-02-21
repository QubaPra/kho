import React, { useState, useEffect } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  useEffect(() => {
      const emailInput = document.getElementById("email");
  
      const handleKeyDown = (e) => {
        if (e.key === " ") {
          e.preventDefault();
        }
      };
  
      emailInput.addEventListener("keydown", handleKeyDown);
  
      return () => {
        emailInput.removeEventListener("keydown", handleKeyDown);
      };
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Submit form
      console.log("Form submitted");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 w-full flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-12 mt-1">Zarejestruj się</h2>
          <form style={{ width: "30%" }} onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-600 text-sm">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Imię i nazwisko *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleNameChange}
              />
              {errors.name && (
                <p className="text-red-500 dark:text-red-600 text-sm">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Hasło *
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

            <button
              type="submit"
              className="w-full bg-blue-600 text-white mt-2 py-2 px-4 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none "
            >
              Zarejestruj się
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
