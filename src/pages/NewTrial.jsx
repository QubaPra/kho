// NewTrial.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import TrialForm from "../components/TrialForm";
import axios from "../api/axios";

const NewTrial = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await axios.post("/trials/me", formData);
      setUser((prevUser) => ({ ...prevUser, has_trial: true }));
      navigate("/");
    } catch (error) {
      console.error("Error creating trial:", error);
    }
  };

  return (
    <TrialForm
      initialData={{ email: user?.login || "" }}
      onSubmit={handleSubmit}
      title="Tworzenie nowej próby HO"
      submitButtonLabel="Utwórz nową próbę"
    />
  );
};

export default NewTrial;