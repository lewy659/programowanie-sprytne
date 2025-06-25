import { createContext, useState, useContext } from "react";

// Tworzymy kontekst
export const AuthContext = createContext();

// Customowy hook, który pozwala łatwo korzystać z kontekstu
export const useAuth = () => useContext(AuthContext);

// Provider dostarczający dane kontekstowe
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");  // Możesz dodać logikę usuwania tokenu po wylogowaniu
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
