import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/logowanie" element={<Login />} />
        <Route path="/rejestracja" element={<Register />} />
        <Route path="/nowa-proba" element={<NewTrial />} />
        <Route path="edycja-proby" element={<EditTrial />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/uzytkownicy" element={<UsersList />} />
        <Route path="/proby" element={<TrialList />} />
        <Route path="/proba/:id" element={<ViewTrial />} />
      </Routes>
    </Router>
  );
}

export default App;
