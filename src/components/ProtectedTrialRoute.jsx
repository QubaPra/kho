import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "../api/axios";

const ProtectedTrialRoute = ({ user, children }) => {
  const { id } = useParams();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    if (!user) {
      setAllowed(false);
      return;
    }

    // Administrator i superuser mają pełen dostęp
    if (user.role === "Administrator" || user.is_superuser) {
      setAllowed(true);
      return;
    }

    const checkAccess = async () => {
      try {
        const { data } = await axios.get(`/trials/${id}`);
        const login = (user.login || "").toLowerCase();
        
        // Sprawdź czy użytkownik jest właścicielem lub opiekunem
        const candidates = [data.user, data.email, data.mentor_mail].map((v) =>
          (v || "").toLowerCase()
        );
        const isOwnerOrMentor = candidates.includes(login);
        
        // Sprawdź uprawnienia według roli kapituły
        if (["Członek KHO", "Członek KHR", "Członek KHO i KHR"].includes(user.role)) {
          // Członek KHO widzi tylko próby HO
          if (user.role === "Członek KHO" && data.trial_rank !== "HO") {
            setAllowed(false);
            return;
          }
          // Członek KHR widzi tylko próby HR
          if (user.role === "Członek KHR" && data.trial_rank !== "HR") {
            setAllowed(false);
            return;
          }
          // Członek KHO i KHR widzi wszystkie
          setAllowed(true);
          return;
        }
        
        // Kandydat/opiekun może widzieć swoją próbę
        setAllowed(isOwnerOrMentor);
      } catch (e) {
        setAllowed(false);
      }
    };

    checkAccess();
  }, [user, id]);

  if (allowed === null) return null;
  return allowed ? children : <Navigate to="/" />;
};

export default ProtectedTrialRoute;
