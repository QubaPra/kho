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
      }
    };

    if (isAuthenticated) {
      fetchUserRole();
    }
  }, [isAuthenticated]);

 

  return (
    <>
      <Navbar setIsAuthenticated={setIsAuthenticated} user={user} isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard user={user}/> : <Navigate to="/logowanie" />} />
        <Route path="/logowanie" element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/rejestracja" element={<Register setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/nowa-proba" element={isAuthenticated ? <NewTrial user={user}/> : <Navigate to="/logowanie" />} />
        <Route path="/edycja-proby" element={isAuthenticated ? <EditTrial user={user}/> : <Navigate to="/logowanie" />} />
        <Route path="/profil" element={isAuthenticated ? <Profil setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/logowanie" />} />
        <Route path="/uzytkownicy" element={isAuthenticated ? <UsersList /> : <Navigate to="/logowanie" />} />
        <Route path="/proby" element={isAuthenticated ? <TrialList /> : <Navigate to="/logowanie" />} />
        <Route path="/proba/:id" element={isAuthenticated ? <ViewTrial /> : <Navigate to="/logowanie" />} />
      </Routes>
    </>
  );
}

export default App;