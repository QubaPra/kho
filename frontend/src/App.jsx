import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import axios from "./api/axios";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('access_token');
    return !!token;
  }); 

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('/users/me/');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user role:', error);
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
      }
    };

    if (isAuthenticated) {
      fetchUserRole();
    }
  }, [isAuthenticated]);

  if (isAuthenticated && user === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar setIsAuthenticated={setIsAuthenticated} user={user} isAuthenticated={isAuthenticated} />
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/logowanie" element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
            <Route path="/rejestracja" element={<Register setIsAuthenticated={setIsAuthenticated}/>} />
            <Route path="*" element={<Navigate to="/logowanie" />} />
          </>
        ) : (
          <>
            <Route path="/" element={
              user.is_mentor || user.role === "Członek kapituły" || user.role === "Administrator" ? (
                <MentorDashboard user={user} />
              ) : user.has_trial ? (
                <Dashboard user={user} />
              ) : (
                <Navigate to="/nowa-proba" />
              )
            } />
            <Route path="/logowanie" element={<Navigate to="/" />} />
            <Route path="/rejestracja" element={<Navigate to="/" />} />
            <Route path="/nowa-proba" element={<NewTrial user={user} />} />
            <Route path="/edycja-proby" element={<EditTrial user={user} />} />
            <Route path="/profil" element={<Profil setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/uzytkownicy" element={<UsersList />} />
            <Route path="/proby" element={<TrialList />} />
            <Route path="/proba/:id" element={<ViewTrial user={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;