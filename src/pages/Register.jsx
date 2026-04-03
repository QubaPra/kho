import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Dodaj import
import axios from "../api/axios";
import { confirm } from "../components/ConfirmationModal";

const Register = ({ setIsAuthenticated }) => {
  // Dodaj argument
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/"); // Przekierowanie na stronę główną, jeśli użytkownik jest zalogowany
    } else {
      setIsAuthenticated(false);
    }
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await axios.post("/register/", {
          login: email.toLowerCase(),
          password: password,
          full_name: name,
        });
        confirm({
                title: "Wymagane potwierdzenie!",
                message: "Rejestracja przebiegła pomyślnie! Potwierdź konto, klikając w link przesłany na podany adres email.",
                isAlert: true,
              });
        navigate("/logowanie");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error === "Login już istnieje"
        ) {
          setErrors({ ...errors, form: "Email jest już zajęty" });
        } else {
          setErrors({ ...errors, form: "Rejestracja nie powiodła się" });
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow sm:p-6 p-4 mb-6 w-full flex flex-col items-center">
      <h2 className="mb-12 mt-1">Zarejestruj się</h2>
      <form className="sm:px-6 px-0 w-sm max-w-full" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block sm:text-sm text-xs font-medium text-gray-700 dark:text-gray-200">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="username email"
            value={email}
            onChange={handleEmailChange}
          />
          {errors.email && (
            <p className="text-red-500 dark:text-red-600 sm:text-sm text-xs">
              {errors.email}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block sm:text-sm text-xs font-medium text-gray-700 dark:text-gray-200">
            Imię i nazwisko *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={handleNameChange}
          />
          {errors.name && (
            <p className="text-red-500 dark:text-red-600 sm:text-sm text-xs">
              {errors.name}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block sm:text-sm text-xs font-medium text-gray-700 dark:text-gray-200">
            Hasło *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={handlePasswordChange}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
          />
          {errors.password && (
            <p className="text-red-500 dark:text-red-600 sm:text-sm text-xs">
              {errors.password}
            </p>
          )}
          {isCapsLockOn && (
            <p className="text-yellow-500 dark:text-yellow-600 sm:text-sm text-xs">
              Capslock jest włączony
            </p>
          )}
        </div>
        {errors.form && (
          <p className="text-red-500 dark:text-red-600 sm:text-sm text-xs">
            {errors.form}
          </p>
        )}
        <button
          type="submit"
          className="w-full mt-2 button-blue justify-center"
        >
          Zarejestruj się
        </button>
      </form>
    </div>
  );
};

export default Register;
