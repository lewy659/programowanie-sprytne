import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [studentId, setStudentId] = useState(null); // <-- NOWOŚĆ: Stan dla ID studenta

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedStudentId = localStorage.getItem('studentId'); // <-- NOWOŚĆ: Pobieranie studentId

    if (token && storedStudentId) {
      // W realnej aplikacji tutaj wysyłalibyśmy zapytanie do API
      // w celu weryfikacji tokenu i ustawienia isLoggedIn na true.
      setIsLoggedIn(true);
      setStudentId(parseInt(storedStudentId, 10)); // <-- Ustaw ID studenta
    }
    setIsLoading(false);
  }, []);

  // Zmień sygnaturę funkcji login, aby przyjmowała token i studentId
  const login = (token, id) => { // <-- ZMIENIONO: Dodano 'id'
    localStorage.setItem('token', token);
    localStorage.setItem('studentId', id); // <-- NOWOŚĆ: Zapisz ID studenta
    setIsLoggedIn(true);
    setStudentId(id); // <-- Ustaw ID studenta w stanie
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentId'); // <-- NOWOŚĆ: Usuń ID studenta
    setIsLoggedIn(false);
    setStudentId(null); // <-- Wyczyść ID studenta
  };

  const value = {
    isLoggedIn,
    isLoading,
    studentId, // <-- Udostępnij studentId w kontekście
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};