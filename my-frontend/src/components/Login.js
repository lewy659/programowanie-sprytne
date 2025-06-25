// src/components/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import "./Login.css";

const API_URL = "http://localhost:8080/api/auth/login";

function Login() {
  const [nrIndeksu, setNrIndeksu] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nrIndeksu, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Błędny login lub hasło. Spróbuj ponownie.";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Sprawdź, czy `data.studentId` istnieje w odpowiedzi z API
      if (data.token && data.studentId) {
        authLogin(data.token, data.studentId); // <--- ZMIENIONA LINIA: Przekazujemy również studentId
        navigate("/");
      } else {
        // Jeśli API nie zwróci studentId, zgłoś błąd
        throw new Error("Brak tokena lub ID studenta w odpowiedzi logowania. Skontaktuj się z administratorem.");
      }

    } catch (err) {
      setError(err.message || "Wystąpił problem z połączeniem. Spróbuj ponownie później.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1 className="login-title">Logowanie do systemu</h1>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="nrIndeksu">Nr Indeksu</label>
            <input
              id="nrIndeksu"
              type="text"
              value={nrIndeksu}
              onChange={(e) => setNrIndeksu(e.target.value)}
              required
              autoComplete="username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Hasło</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <p className="register-link">
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;