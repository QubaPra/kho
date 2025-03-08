// EditTrial.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrialForm from "../components/TrialForm";
import axios from "../api/axios";

const EditTrial = () => {
  const [initialData, setInitialData] = useState(() => {
    const savedTrial = localStorage.getItem("trial");
    return savedTrial ? JSON.parse(savedTrial) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrialData = async () => {
      try {
        const response = await axios.get("/trials/me");
        setInitialData(response.data);
      } catch (error) {
        console.error("Error fetching trial data:", error);
      }
    };
    fetchTrialData();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      await axios.patch("/trials/me", formData);
      navigate("/");
    } catch (error) {
      console.error("Error updating trial:", error);
    }
  };

  return (
    <TrialForm
      initialData={initialData}
      onSubmit={handleSubmit}
      title="Edycja twojej próby HO"
      submitButtonLabel="Zapisz zmiany"
    />
  );
};

export default EditTrial;