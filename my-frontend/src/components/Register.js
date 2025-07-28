import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css"; 

const Register = () => {
  const [formData, setFormData] = useState({
    nrIndeksu: "",
    imie: "",
    nazwisko: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true); // Rozpocznij ładowanie

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Rejestracja nie powiodła się. Spróbuj ponownie.";
        throw new Error(errorMessage);
      }

      setSuccessMsg("Rejestracja udana! Przekierowuję do logowania...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Wystąpił problem z połączeniem. Spróbuj ponownie później.");
    } finally {
      setIsLoading(false); // Zakończ ładowanie
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h1 className="register-title">Rejestracja</h1>

        {error && <p className="register-error">{error}</p>}
        {successMsg && <p className="register-success">{successMsg}</p>}

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <div className="form-group">
            <label htmlFor="nrIndeksu">Numer Indeksu</label>
            <input
              type="text"
              id="nrIndeksu"
              name="nrIndeksu"
              placeholder="np. 123456"
              value={formData.nrIndeksu}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="imie">Imię</label>
            <input
              type="text"
              id="imie"
              name="imie"
              placeholder="Twoje imię"
              value={formData.imie}
              onChange={handleChange}
              required
              autoComplete="given-name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="nazwisko">Nazwisko</label>
            <input
              type="text"
              id="nazwisko"
              name="nazwisko"
              placeholder="Twoje nazwisko"
              value={formData.nazwisko}
              onChange={handleChange}
              required
              autoComplete="family-name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Hasło</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Silne hasło"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? "Rejestracja..." : "Zarejestruj się"}
          </button>
        </form>

        <p className="login-link">
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;