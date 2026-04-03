import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { confirm } from "../components/ConfirmationModal";

const VerifyAccount = ({ setIsAuthenticated }) => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await axios.get(`/verify/${id}/${token}/`);
        
        const ok = await confirm({
          title: "Sukces!",
          message: "Konto zostało pomyślnie aktywowane!",
          isAlert: true,
        });
        if (ok) {
        const data = response.data;

        // Zapisujemy token w localStorage
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // Ustawiamy stan logowania w App.jsx
        setIsAuthenticated(true);
        
        // Przekierowujemy na Dashboard tylko po potwierdzeniu        
          navigate("/");
        }
        
      } catch (error) {
        console.error("Błąd podczas aktywacji konta:", error);
        const ok = await confirm({
          title: "Błąd!",
          message: error.response.data.error || "Błąd podczas aktywacji konta",
          isAlert: true,
        });
        // Przekierowujemy na Dashboard tylko po potwierdzeniu
        if (ok) {
          navigate("/register");
        }
        
        
      }
    };

    verifyAccount();
  }, [id, token, navigate]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow sm:p-6 p-4 mb-6 w-full flex flex-col items-left">
      <h2 className="mb-12 mt-1"> Trwa aktywacja konta... </h2>
    </div>
  );
};

export default VerifyAccount;
