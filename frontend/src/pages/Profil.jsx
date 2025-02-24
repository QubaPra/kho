import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import Modal from "react-modal";

Modal.setAppElement('#root');

const Profil = ({ user, setIsAuthenticated }) => {
  const [email, setEmail] = useState(user.login);
  const [name, setName] = useState(user.full_name);
  const [errors, setErrors] = useState({});
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!currentPassword) {
      newErrors.currentPassword = "Obecne hasło jest wymagane";
    }
    if (!newPassword) {
      newErrors.newPassword = "Nowe hasło jest wymagane";
    } else if (newPassword.length < 4) {
      newErrors.newPassword = "Hasło musi mieć minimum 4 znaki";
    } else if (/\s/.test(newPassword)) {
      newErrors.newPassword = "Hasło nie może zawierać spacji";
    } else if (newPassword.length > 100) {
      newErrors.newPassword = "Hasło nie może być dłuższe niż 100 znaków";
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
    setNewPassword(value);
    setErrors((prevErrors) => ({ ...prevErrors, newPassword: "" }));
  };

  const handleCurrentPasswordChange = (e) => {
    const value = e.target.value.replace(/\s/g, ""); // Usuwa spacje
    setCurrentPassword(value);
    setErrors((prevErrors) => ({ ...prevErrors, currentPassword: "" }));
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

  const handleSaveClick = async () => {
    if (validate()) {
      try {
        await axios.patch("/users/me/", {
          login: email,
          full_name: name,
        });
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  const handleDeleteClick = async () => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć swoje konto?");
    if (confirmed) {
      try {
        await axios.delete("/users/me/");
        // Wylogowanie użytkownika (np. usunięcie tokenu z localStorage)
        localStorage.removeItem("access_token");
        localStorage.removeItem("trial");
        localStorage.removeItem("tasks");
        setIsAuthenticated(false);
      } catch (error) {
        console.error("Error deleting user account:", error);
      }
    }
  };

  const handlePasswordEditClick = () => {
    setIsPasswordModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
    document.body.classList.remove("modal-open");
    setErrors({});
    setCurrentPassword("");
    setNewPassword("");
  };

  const handlePasswordSave = async () => {
    if (validatePassword()) {
      try {
        const response = await axios.post("/users/me/password/", {
          old_password: currentPassword,
          new_password: newPassword,
        });
        setIsPasswordModalOpen(false);
        document.body.classList.remove("modal-open");
        alert(response.data.success || "Hasło zostało zmienione");
      } catch (error) {
        console.error("Error updating password:", error);
        alert(error.response.data.error || "Wystąpił błąd podczas zmiany hasła");
      }
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 w-full flex flex-col items-left">
          <h2 className="text-2xl font-semibold mb-12 mt-1">Twoje dane</h2>
          <div style={{ width: "45%" }}>
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
              <div className="h-4">
                {errors.email && (
                  <p className="text-red-500 dark:text-red-600 text-sm">
                    {errors.email}
                  </p>
                )}
              </div>
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
              <div className="h-4">
                {errors.name && (
                  <p className="text-red-500 dark:text-red-600 text-sm">
                    {errors.name}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Rola
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={user.role}
                disabled
              />
            </div>

            <div className="flex space-x-4">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleSaveClick}
                  className="w-full bg-green-600 text-white mt-2 py-2 px-4 flex justify-center space-x-1 rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none"
                >
                  <span className="material-symbols-outlined">check</span>
                  <span>Zapisz</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="w-full bg-blue-600 text-white mt-2 py-2 px-4 flex justify-center space-x-1 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none"
                >
                  <span className="material-symbols-outlined">edit_square</span>
                  <span>Edytuj dane</span>
                </button>
              )}
              <button
                type="button"
                onClick={handlePasswordEditClick}
                className="w-full bg-yellow-600 text-white mt-2 py-2 px-4 flex justify-center space-x-1 rounded-lg hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800 focus:outline-none"
              >
                <span className="material-symbols-outlined">lock</span>
                <span>Edytuj hasło</span>
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="w-full text-white mt-2 py-2 px-4 rounded-lg flex justify-center space-x-1 bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none"
              >
                <span className="material-symbols-outlined">delete</span>
                <span>Usuń konto</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isPasswordModalOpen}
        onRequestClose={handlePasswordModalClose}
        contentLabel="Zmiana hasła"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-2xl font-semibold mb-2">Zmiana hasła</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Obecne hasło
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            className="w-full p-2 border border-gray-300 rounded"
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
          />
          <div className="h-4">
            {errors.currentPassword && (
              <p className="text-red-500 dark:text-red-600 text-sm">
                {errors.currentPassword}
              </p>
            )}
          </div>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nowe hasło
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 border border-gray-300 rounded"
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
          />
          <div className="h-4">
            {errors.newPassword && (
              <p className="text-red-500 dark:text-red-600 text-sm">
                {errors.newPassword}
              </p>
            )}
            {isCapsLockOn && (
              <p className="text-yellow-500 dark:text-yellow-600 text-sm">
                CapsLock jest włączony
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handlePasswordSave}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none"
          >
            Zapisz
          </button>
          <button
            type="button"
            onClick={handlePasswordModalClose}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none"
          >
            Anuluj
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Profil;