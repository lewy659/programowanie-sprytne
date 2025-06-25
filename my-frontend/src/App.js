// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthContext";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import ProjektListPage from "./components/ProjektList/ProjektListPage";
import AddProjekt from "./components/AddProjekt";
import ProjektDetails from "./components/ProjektDetails";
import Dashboard from "./components/Dashboard";
import TeamProjectsPage from "./components/TeamProjects/TeamProjectsPage";
import Chat from "./components/Chat/Chat"; // <-- NOWOŚĆ: Importujemy komponent Chat

function App() {
  return (
    <Router>
      <Routes>
        {/* Trasy publiczne, dostępne dla każdego */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Trasy chronione, wymagające zalogowania */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Strony renderowane wewnątrz głównego layoutu */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/projekty" element={<ProjektListPage />} />
            <Route path="/projekty/nowy" element={<AddProjekt />} />
            <Route path="/projekty/:id" element={<ProjektDetails />} />
            <Route path="/moje-zespoly" element={<TeamProjectsPage />} />
            {/* <-- NOWOŚĆ: Dodajemy trasę dla Czatu */}
            <Route path="/chat" element={<Chat />} />
            {/* Tutaj możesz dodać więcej chronionych tras, np. /ustawienia, /profil itp. */}
          </Route>
        </Route>

        {/* Opcjonalnie: trasa dla 404 Not Found */}
        <Route path="*" element={<div>404 - Strony nie znaleziono</div>} />
      </Routes>
    </Router>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}