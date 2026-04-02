import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MentorDashboard from "./pages/MentorDashboard";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewTrial from "./pages/NewTrial";
import EditTrial from "./pages/EditTrial";
import Profil from "./pages/Profil";
import UsersList from "./pages/UsersList";
import TrialList from "./pages/TrialList";
import ViewTrial from "./pages/ViewTrial";
import Footer from "./components/Footer";
import axios from "./api/axios";
import { ConfirmationProvider } from "./components/ConfirmationModal";
import VerifyAccount from "./pages/VerifyAccount";
import GlobalLoader from "./components/GlobalLoader";
import ProtectedTrialRoute from "./components/ProtectedTrialRoute";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("access_token");
    return !!token;
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/users/me/");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user role:", error);
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
      }
    };

    if (isAuthenticated) {
      fetchUserRole();
    }
  }, [isAuthenticated]);

  if (isAuthenticated && user === null) {
    return <GlobalLoader />;
  }

  return (
    <ConfirmationProvider>
      <GlobalLoader />
      <Navbar
        setIsAuthenticated={setIsAuthenticated}
        user={user}
        isAuthenticated={isAuthenticated}
      />

      <main className="sm:mt-16 mt-12  min-h-screen">
        <div className="max-w-7xl mx-auto px-2 py-4 sm:px-4 sm:py-6">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route
                  path="/logowanie"
                  element={<Login setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route
                  path="/rejestracja"
                  element={<Register setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route path="*" element={<Navigate to="/logowanie" />} />
              </>
            ) : (
              <>
                <Route
                  path="/"
                  element={
                    ["Członek KHR", "Członek KHO i KHR", "Administrator"].includes(user.role) ? (
                      <MentorDashboard user={user} />
                    ) : user.has_trial ? (
                      <Dashboard setUser={setUser} user={user} />
                    ) : (
                      <Navigate to="/nowa-proba" />
                    )
                  }
                />
                <Route path="/logowanie" element={<Navigate to="/" />} />
                <Route path="/rejestracja" element={<Navigate to="/" />} />
                <Route
                  path="/nowa-proba"
                  element={
                    user.has_trial ||
                    ["Członek KHR", "Członek KHO i KHR", "Administrator"].includes(user.role) ? (
                      <Navigate to="/" />
                    ) : (
                      <NewTrial setUser={setUser} user={user} />
                    )
                  }
                />
                <Route
                  path="/edycja-proby"
                  element={
                    user.has_trial ? (
                      <EditTrial user={user} />
                    ) : (
                      <Navigate to="/nowa-proba" />
                    )
                  }
                />
                <Route
                  path="/profil"
                  element={
                    <Profil
                      setIsAuthenticated={setIsAuthenticated}
                      user={user}
                    />
                  }
                />
                <Route
                  path="/uzytkownicy"
                  element={
                    user.role === "Administrator" ? (
                      <UsersList currentUser={user} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/proby"
                  element={
                    user.role === "Administrator" ||
                    ["Członek KHO", "Członek KHR", "Członek KHO i KHR"].includes(user.role) ? (
                      <TrialList user={user} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/proba/:id"
                  element={
                    <ProtectedTrialRoute user={user}>
                      <ViewTrial user={user} />
                    </ProtectedTrialRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
            <Route path="/weryfikacja/:id/:token" element={<VerifyAccount setIsAuthenticated={setIsAuthenticated} />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </ConfirmationProvider>
  );
};

export default App;
