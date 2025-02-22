import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewTrial from "./pages/NewTrial";
import EditTrial from "./pages/EditTrial";
import Profil from "./pages/Profil";
import UsersList from "./pages/UsersList";
import TrialList from "./pages/TrialList";
import ViewTrial from "./pages/ViewTrial";
import axios from "axios";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8000/api/users/me/', {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [isAuthenticated]);

  return (
    <>
      <Navbar setIsAuthenticated={setIsAuthenticated} user={user} />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/logowanie" />} />
        <Route path="/logowanie" element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/rejestracja" element={<Register setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/nowa-proba" element={isAuthenticated ? <NewTrial /> : <Navigate to="/logowanie" />} />
        <Route path="/edycja-proby" element={isAuthenticated ? <EditTrial /> : <Navigate to="/logowanie" />} />
        <Route path="/profil" element={isAuthenticated ? <Profil /> : <Navigate to="/logowanie" />} />
        <Route path="/uzytkownicy" element={isAuthenticated ? <UsersList /> : <Navigate to="/logowanie" />} />
        <Route path="/proby" element={isAuthenticated ? <TrialList /> : <Navigate to="/logowanie" />} />
        <Route path="/proba/:id" element={isAuthenticated ? <ViewTrial /> : <Navigate to="/logowanie" />} />
      </Routes>
    </>
  );
}

export default App;