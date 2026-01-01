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

    if (user.role === "Administrator" || user.role === "Członek kapituły") {
      setAllowed(true);
      return;
    }

    const checkAccess = async () => {
      try {
        const { data } = await axios.get(`/trials/${id}`);
        const login = (user.login || "").toLowerCase();
        const candidates = [data.user, data.email, data.mentor_mail].map((v) =>
          (v || "").toLowerCase()
        );
        setAllowed(candidates.includes(login));
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
