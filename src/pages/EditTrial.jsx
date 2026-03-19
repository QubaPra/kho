// EditTrial.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrialForm from "../components/TrialForm";
import axios from "../api/axios";
// usunięto confirm — edycja zawsze dozwolona niezależnie od statusu

const EditTrial = ({ user }) => {
  const [initialData, setInitialData] = useState(() => {
    const savedTrial = localStorage.getItem("trial");
    return savedTrial ? JSON.parse(savedTrial) : null;
  });
  const [externalErrors, setExternalErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrialData = async () => {
      try {
        const response = await axios.get("/trials/me/");
        setInitialData(response.data);
      } catch (error) {
        console.error("Error fetching trial data:", error);
      }
    };
    fetchTrialData();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      await axios.patch("/trials/me/", formData);
      navigate("/");
    } catch (error) {
      // Obsługa błędu 400 z backendu (np. nieistniejący mentor_mail)
      if (error?.response?.status === 400) {
        const data = error.response.data;
        // Priorytetyzuj komunikat dla mentor_mail
        if (data?.mentor_mail) {
          setExternalErrors({ mentor_mail: "Nie ma takiego użytkownika" });
        } else {
          setExternalErrors({ mentor_mail: "Nie ma takiego użytkownika" });
        }
      } else {
        console.error("Błąd podczas aktualizacji próby:", error);
      }
    }
  };

  return (
    <TrialForm
      initialData={initialData}
      onSubmit={handleSubmit}
      title="Edycja twojej próby HO"
      submitButtonLabel="Zapisz zmiany"
      loginEmail={user?.login || ""}
      externalErrors={externalErrors}
      clearExternalError={(field) =>
        setExternalErrors((prev) => (field in prev ? { ...prev, [field]: "" } : prev))
      }
    />
  );
};

export default EditTrial;
