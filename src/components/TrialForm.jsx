import React, { useState, useEffect } from "react";
import teams from "../data/teams";
import Cleave from "cleave.js/react";

const TrialForm = ({
  initialData = {},
  onSubmit,
  title,
  submitButtonLabel,
  externalErrors = {},
  clearExternalError = () => {},
  loginEmail = "",
}) => {
  const formatDateForInput = (date) => {
    if (!date) return "";
    // If already in DD.MM.YYYY, keep as is
    if (date.includes(".")) return date;
    // Support YYYY-MM-DD or ISO strings
    const [year, month, day] = (date.split("T")[0] || "").split("-");
    if (year && month && day) return `${day}.${month}.${year}`;
    return date;
  };

  const [formData, setFormData] = useState({
    email: initialData.email || "",
    mentor_mail: initialData.mentor_mail || "",
    mentor_name: initialData.mentor_name || "",
    birth_date: formatDateForInput(initialData.birth_date) || "",
    team: initialData.team || "",
    rank: initialData.rank || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault();
      }
    };

  const inputs = ["cleaveDate", "privEmail", "mentorEmail"];
    inputs.forEach((id) => {
      const input = document.getElementById(id);
      if (input) input.addEventListener("keydown", handleKeyDown);
    });

    return () => {
      inputs.forEach((id) => {
        const input = document.getElementById(id);
        if (input) input.removeEventListener("keydown", handleKeyDown);
      });
    };
  }, []);

  // Sync form when initialData updates (e.g., after fetch)
  useEffect(() => {
    if (!initialData) return;
    setFormData((prev) => ({
      ...prev,
      email: initialData.email || "",
      mentor_mail: initialData.mentor_mail || "",
      mentor_name: initialData.mentor_name || "",
      birth_date: formatDateForInput(initialData.birth_date) || "",
      team: initialData.team || "",
      rank: initialData.rank || "",
    }));
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-ZÀ-Ž][a-zà-ž]+(?:[-\s][A-ZÀ-Ž][a-zà-ž]+)+$/;
    const today = new Date().toISOString().split("T")[0];

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email do kontaktu jest wymagany";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email do kontaktu jest nieprawidłowy";
    } else if (formData.email.length > 100) {
      newErrors.email = "Email do kontaktu nie może być dłuższy niż 100 znaków";
    }

    // Mentor email validation (porównanie z emailem logowania użytkownika)
    const loginNormalized = (loginEmail || "").trim().toLowerCase();
    const mentorNormalized = (formData.mentor_mail || "").trim().toLowerCase();
    if (loginNormalized && mentorNormalized && mentorNormalized === loginNormalized) {
      newErrors.mentor_mail = "Email opiekuna nie może być taki sam jak twój";
    } else if (formData.mentor_mail) {
      if (!emailRegex.test(formData.mentor_mail)) {
        newErrors.mentor_mail = "Email opiekuna jest nieprawidłowy";
      } else if (formData.mentor_mail.length > 100) {
        newErrors.mentor_mail =
          "Email opiekuna nie może być dłuższy niż 100 znaków";
      }
    }

    // Name validation
    if (formData.mentor_name) {
      if (!nameRegex.test(formData.mentor_name)) {
        newErrors.mentor_name = "Imię i nazwisko są nieprawidłowe";
      } else if (formData.mentor_name.length > 100) {
        newErrors.mentor_name =
          "Imię i nazwisko nie mogą być dłuższe niż 100 znaków";
      }
    }

    // Date validation
    if (!formData.birth_date) {
      newErrors.birth_date = "Data urodzenia jest wymagana";
    } else if (formatDateForState(formData.birth_date) >= today) {
      newErrors.birth_date =
        "Data urodzenia musi być wcześniejsza niż dzisiejsza";
    }

    // Team validation
    if (!formData.team) {
      newErrors.team = "Drużyna jest wymagana";
    }

    // Rank validation
    if (!formData.rank) {
      newErrors.rank = "Stopień jest wymagany";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    // Zaktualizuj dane formularza
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Czyść błąd dla edytowanego pola
    setErrors((prev) => {
      const next = { ...prev, [field]: "" };
      // Natychmiastowa walidacja: email opiekuna nie może być taki sam jak email logowania użytkownika
      if (field === "mentor_mail") {
        const newMentorMail = (value || "").trim().toLowerCase();
        const userLogin = (loginEmail || "").trim().toLowerCase();
        const equalMessage = "Email opiekuna nie może być taki sam jak twój";

        if (newMentorMail && userLogin && newMentorMail === userLogin) {
          next.mentor_mail = equalMessage;
        } else if (next.mentor_mail === equalMessage) {
          // Usuń tylko błąd równości, pozostaw inne potencjalne błędy nietknięte
          next.mentor_mail = "";
        }
      }
      return next;
    });
    // wyczyść ewentualny błąd z backendu po edycji pola
    clearExternalError(field);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formattedData = {
        ...formData,
        email: (formData.email || "").toLowerCase(),
        mentor_mail: (formData.mentor_mail || "").toLowerCase(),
        birth_date: formatDateForState(formData.birth_date),
      };
      onSubmit(formattedData);
    }
  };

  const formatDateForState = (date) => {
    const [day, month, year] = date.split(".");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow sm:p-6 p-4 mb-6 w-full flex flex-col">
      <h2 className="mb-12">{title}</h2>
      <form
        className="flex sm:flex-row flex-col justify-between sm:max-w-4xl"
        onSubmit={handleSubmit}
      >
        <div className="sm:w-5/12">
          <div className="mb-4">
            <label className="block sm:text-sm text-xs font-medium text-gray-700 dark:text-gray-200">
              Email do kontaktu
            </label>
            <input
              type="email"
              id="privEmail"
              name="privEmail"
              value={formData.email}
              onChange={handleInputChange("email")}
              className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
            {(errors.email || externalErrors.email) && (
              <p className="text-red-500 dark:text-red-600 sm:text-sm text-xs">
                {errors.email || externalErrors.email}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block sm:text-sm text-xs font-medium text-gray-700 dark:text-gray-200">
              Data urodzenia
            </label>
            <Cleave
              placeholder="DD.MM.YYYY"
              options={{ date: true, datePattern: ["d", "m", "Y"], delimiter: "."}}
              id="cleaveDate"
              value={formData.birth_date}
              onChange={handleInputChange("birth_date")}
              inputMode="numeric"
              className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
            {(errors.birth_date || externalErrors.birth_date) && (
              <p className="text-red-500 dark:text-red-600 sm:text-sm text-xs">
                {errors.birth_date || externalErrors.birth_date}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block sm:text-sm text-xs font-medium text-gray-700 dark:text-gray-200">
              Drużyna
            </label>
            <select
              id="team"
              value={formData.team}
              onChange={handleInputChange("team")}
              className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="">Wybierz drużynę</option>
              {teams.map((teamName) => (
                <option key={teamName} value={teamName}>
                  {teamName}
                </option>
              ))}
            </select>
            {(errors.team || externalErrors.team) && (
              <p className="text-red-500 dark:text-red-600 sm:text-sm text-xs">
                {errors.team || externalErrors.team}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block sm:text-sm text-xs font-medium text-gray-700 dark:text-gray-200">
              Stopień
            </label>
            <select
              id="rank"
              value={formData.rank}
              onChange={handleInputChange("rank")}
              className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="">Wybierz stopień</option>
              <option value="mł.">mł.</option>
              <option value="wyw.">wyw.</option>
              <option value="ćw.">ćw.</option>
            </select>
            {(errors.rank || externalErrors.rank) && (
              <p className="text-red-500 dark:text-red-600 sm:text-sm text-xs">
                {errors.rank || externalErrors.rank}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between sm:w-5/12">
          <div>
            <div className="mb-4">
              <label className="block sm:text-sm text-xs font-medium text-gray-700 dark:text-gray-200">
                Email opiekuna
              </label>
              <input
                type="email"
                id="mentorEmail"
                name="mentorEmail"
                value={formData.mentor_mail}
                onChange={handleInputChange("mentor_mail")}
                className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              />
              {(errors.mentor_mail || externalErrors.mentor_mail) && (
                <p className="text-red-500 dark:text-red-600 sm:text-sm text-xs">
                  {errors.mentor_mail || externalErrors.mentor_mail}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block sm:text-sm text-xs font-medium text-gray-700 dark:text-gray-200">
                Imię i nazwisko opiekuna
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.mentor_name}
                onChange={handleInputChange("mentor_name")}
                className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              />
              {(errors.mentor_name || externalErrors.mentor_name) && (
                <p className="text-red-500 dark:text-red-600 sm:text-sm text-xs">
                  {errors.mentor_name || externalErrors.mentor_name}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white mt-2 mb-4 py-2 px-4 rounded-lg hover:bg-blue-800 focus:outline-none"
          >
            {submitButtonLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrialForm;
