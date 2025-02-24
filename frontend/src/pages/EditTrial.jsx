import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const EditTrial = () => {
  const [privEmail, setPrivateEmail] = useState("");
  const [mentorMail, setMentorEmail] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [team, setTeam] = useState("");
  const [rank, setRank] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrialData = async () => {
      try {
        const response = await axios.get("/trials/me");
        const trial = response.data;
        setPrivateEmail(trial.email);
        setMentorEmail(trial.mentor_mail);
        setName(trial.mentor_name);
        setDate(trial.birth_date);
        setTeam(trial.team);
        setRank(trial.rank);
      } catch (error) {
        console.error("Błąd podczas pobierania danych próby:", error);
      }
    };

    fetchTrialData();

    const dateInput = document.getElementById("date");
    const privEmailInput = document.getElementById("privEmail");
    const mentorEmailInput = document.getElementById("mentorEmail");

    const handleKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault();
      }
    };

    dateInput.addEventListener("keydown", handleKeyDown);
    privEmailInput.addEventListener("keydown", handleKeyDown);
    mentorEmailInput.addEventListener("keydown", handleKeyDown);

    return () => {
      dateInput.removeEventListener("keydown", handleKeyDown);
      privEmailInput.removeEventListener("keydown", handleKeyDown);
      mentorEmailInput.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-ZÀ-Ž][a-zà-ž]+(?:[-\s][A-ZÀ-Ž][a-zà-ž]+)+$/;
    const today = new Date().toISOString().split("T")[0]; // dzisiejsza data w formacie YYYY-MM-DD

    if (!privEmail) {
      newErrors.privEmail = "Email do kontaktu jest wymagany";
    } else if (!emailRegex.test(privEmail)) {
      newErrors.privEmail = "Email do kontaktu jest nieprawidłowy";
    } else if (privEmail.length > 100) {
      newErrors.privEmail =
        "Email do kontaktu nie może być dłuższy niż 100 znaków";
    }

    if (mentorMail === privEmail) {
      newErrors.mentorMail = "Email opiekuna nie może być taki sam jak twój";
    } else if (mentorMail) {
      if (!emailRegex.test(mentorMail)) {
        newErrors.mentorMail = "Email opiekuna jest nieprawidłowy";
      } else if (mentorMail.length > 100) {
        newErrors.mentorMail =
          "Email opiekuna nie może być dłuższy niż 100 znaków";
      }
    }

    if (name) {
      if (!nameRegex.test(name)) {
        newErrors.name = "Imię i nazwisko są nieprawidłowe";
      } else if (name.length > 100) {
        newErrors.name = "Imię i nazwisko nie mogą być dłuższe niż 100 znaków";
      }
    }

    if (!date) {
      newErrors.date = "Data urodzenia jest wymagana";
    } else if (date >= today) {
      newErrors.date = "Data urodzenia musi być wcześniejsza niż dzisiejsza";
    }

    if (!team) {
      newErrors.team = "Drużyna jest wymagana";
    }

    if (!rank) {
      newErrors.rank = "Stopień jest wymagany";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrivateEmailChange = (e) => {
    setPrivateEmail(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, privEmail: "" }));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
  };

  const handleMentorEmailChange = (e) => {
    setMentorEmail(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, mentorMail: "" }));
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, date: "" }));
  };

  const handleTeamChange = (e) => {
    setTeam(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, team: "" }));
  };

  const handleRankChange = (e) => {
    setRank(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, rank: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await axios.patch("/trials/me", {
          email: privEmail,
          mentor_mail: mentorMail,
          mentor_name: name,
          birth_date: date,
          team: team,
          rank: rank,
        });
        navigate("/");
      } catch (error) {
        console.error("Błąd podczas aktualizacji próby:", error);
      }
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 w-full flex flex-col">
          <h2 className="text-2xl font-semibold mb-12">
            Edycja twojej próby HO
          </h2>
          <form
            className="flex justify-between"
            style={{ width: "80%" }}
            onSubmit={handleSubmit}
          >
            <div style={{ width: "45%" }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email do kontaktu
                </label>
                <input
                  type="email"
                  id="privEmail"
                  name="privEmail"
                  value={privEmail}
                  onChange={handlePrivateEmailChange}
                />
                {errors.privEmail && (
                  <p className="text-red-500 dark:text-red-600 text-sm">
                    {errors.privEmail}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Data urodzenia
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={date}
                  onChange={handleDateChange}
                />
                {errors.date && (
                  <p className="text-red-500 dark:text-red-600 text-sm">
                    {errors.date}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Drużyna
                </label>
                <select id="team" value={team} onChange={handleTeamChange}>
                  <option value="">Wybierz drużynę</option>
                  <option value="40 KDH Barykada">40 KDH Barykada</option>
                  <option value="5 KDH Piorun">5 KDH Piorun</option>
                  <option value="19 KLDH Ptaki Polskie">
                    19 KLDH Ptaki Polskie
                  </option>
                  <option value="10 KDH Dzieci Słońca">
                    10 KDH Dzieci Słońca
                  </option>
                  <option value="40 KGZ Smocze Bractwo">
                    40 KGZ Smocze Bractwo
                  </option>
                </select>
                {errors.team && (
                  <p className="text-red-500 dark:text-red-600 text-sm">
                    {errors.team}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Stopień
                </label>
                <select id="rank" value={rank} onChange={handleRankChange}>
                  <option value="">Wybierz stopień</option>
                  <option value="mł.">mł.</option>
                  <option value="wyw.">wyw.</option>
                  <option value="ćw.">ćw.</option>
                </select>
                {errors.rank && (
                  <p className="text-red-500 dark:text-red-600 text-sm">
                    {errors.rank}
                  </p>
                )}
              </div>
            </div>

            <div
              style={{ width: "45%" }}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Email opiekuna
                  </label>
                  <input
                    type="email"
                    id="mentorEmail"
                    name="mentorEmail"
                    value={mentorMail}
                    onChange={handleMentorEmailChange}
                  />
                  {errors.mentorMail && (
                    <p className="text-red-500 dark:text-red-600 text-sm">
                      {errors.mentorMail}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Imię i nazwisko opiekuna
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
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 text-white mt-2 mb-4 py-2 px-4 rounded-lg hover:bg-blue-800 focus:outline-none "
              >
                Zapisz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTrial;
