// src/components/AddProjekt.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProjekt.css"; // Import CSS jest poprawny dla tej ścieżki

function AddProjekt() {
  const [nazwa, setNazwa] = useState("");
  const [opis, setOpis] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projekt = { nazwa, opis };
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Brak tokenu JWT. Zaloguj się ponownie.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/projekty", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projekt),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Nie udało się dodać projektu.");
      }

      setSuccess(true);
      setError(null);
      setNazwa("");
      setOpis("");

      // KLUCZOWA ZMIANA: Przekazanie stanu do komponentu ProjektListPage
      navigate("/projekty", { state: { refreshProjects: true } }); 

    } catch (error) {
      setError("Błąd: " + error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="add-projekt">
      <h2>Dodaj Nowy Projekt</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nazwa">Nazwa projektu:</label>
          <input
            type="text"
            id="nazwa"
            value={nazwa}
            onChange={(e) => setNazwa(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="opis">Opis projektu:</label>
          <textarea
            id="opis"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Dodaj Projekt</button>
      </form>

      {/* Używamy klas CSS do stylizacji komunikatów */}
      {success && <p className="success-message">✅ Projekt został dodany!</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default AddProjekt;