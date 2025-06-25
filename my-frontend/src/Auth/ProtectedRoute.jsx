import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

// WAŻNE: Upewnij się, że NIE MA tutaj importu './Layout.css'
// import './Layout.css'; // <-- JEŚLI TO MASZ, USUŃ TO!

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // Możesz tu wstawić globalny spinner, jeśli chcesz
    return <div>Ładowanie sesji...</div>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;