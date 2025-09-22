// NewTrial.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrialForm from "../components/TrialForm";
import axios from "../api/axios";

const NewTrial = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [externalErrors, setExternalErrors] = useState({});

  const handleSubmit = async (formData) => {
    try {
      await axios.post("/trials/me", formData);
      setUser((prevUser) => ({ ...prevUser, has_trial: true }));
      navigate("/");
    } catch (error) {
      if (error?.response?.status === 400) {
        const data = error.response.data;
        if (data?.mentor_mail) {
          setExternalErrors({ mentor_mail: "Nie ma takiego użytkownika" });
        } else {
          setExternalErrors({ mentor_mail: "Nie ma takiego użytkownika" });
        }
      } else {
        console.error("Error creating trial:", error);
      }
    }
  };

  return (
    <TrialForm
      initialData={{ email: user?.login || "" }}
      onSubmit={handleSubmit}
      title="Tworzenie nowej próby HO"
      submitButtonLabel="Utwórz nową próbę"
      loginEmail={user?.login || ""}
      externalErrors={externalErrors}
      clearExternalError={(field) =>
        setExternalErrors((prev) => (field in prev ? { ...prev, [field]: "" } : prev))
      }
    />
  );
};

export default NewTrial;
