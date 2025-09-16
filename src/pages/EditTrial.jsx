// EditTrial.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrialForm from "../components/TrialForm";
import axios from "../api/axios";
import { confirm } from "../components/ConfirmationModal";

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
      const response = await axios.get("/trials/me");
      const trial = response.data;

      if (
        trial.status !== "nowa próba" &&
        trial.status !== "do akceptacji przez opiekuna" &&
        trial.status !== "odrzucona przez kapitułę (do poprawy)" &&
        trial.status &&
        !trial.status.includes("(edytowano)")
      ) {
        const result = await confirm({
          message: "Edytujesz zatwierdzoną próbę. Czy chcesz kontynuować?",
          isDanger: true,
        });
        if (!result) return;
      }

      if (
        (trial.status &&
          trial.status.includes("zaakceptowana przez opiekuna")) ||
        trial.status === "odrzucona przez kapitułę (do poprawy)"
      ) {
        try {
          await axios.patch("/trials/me", {
            status: "do akceptacji przez opiekuna",
          });
          setInitialData((prevTrial) => ({
            ...prevTrial,
            status: "do akceptacji przez opiekuna",
          }));
        } catch (error) {
          console.error("Błąd podczas aktualizacji statusu próby:", error);
          return;
        }
      } else if (
        trial.status &&
        !trial.status.includes("(edytowano)") &&
        trial.status !== "do akceptacji przez opiekuna" &&
        trial.status !== "odrzucona przez kapitułę (do poprawy)" &&
        trial.status !== "nowa próba"
      ) {
        try {
          await axios.patch("/trials/me", {
            status: `${trial.status} (edytowano)`,
          });
          setInitialData((prevTrial) => ({
            ...prevTrial,
            status: `${prevTrial.status} (edytowano)`,
          }));
        } catch (error) {
          console.error("Błąd podczas aktualizacji statusu próby:", error);
          return;
        }
      }

      await axios.patch("/trials/me", formData);
      navigate("/");
    } catch (error) {
      console.error("Błąd podczas aktualizacji próby:", error);
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
