import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaProjectDiagram, FaUsers, FaComments, FaSignOutAlt } from 'react-icons/fa'; // <-- NOWOŚĆ: FaComments
import { useAuth } from '../../Auth/AuthContext';
import './Layout.css';

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <FaProjectDiagram className="logo-icon" />
          <h1 className="logo-text">Projekty</h1>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end>
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/projekty">
            <FaProjectDiagram />
            <span>Projekty</span>
          </NavLink>
          <NavLink to="/moje-zespoly">
            <FaUsers />
            <span>Moje Zespoły</span>
          </NavLink>
          {/* --- NOWA ZAKŁADKA CZAT --- */}
          <NavLink to="/chat"> {/* Dodaj nową ścieżkę do czatu */}
            <FaComments /> {/* Użyj ikony dymków rozmowy */}
            <span>Czat</span>
          </NavLink>
          {/* ------------------------- */}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt />
            <span>Wyloguj</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;