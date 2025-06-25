import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjektList.css";

const API_URL = "http://localhost:8080/api/projekty";

const SkeletonCard = () => (
  <div className="projekt-card skeleton">
    <div className="skeleton-text skeleton-title"></div>
    <div className="skeleton-text skeleton-desc"></div>
  </div>
);

const pageSize = 6; // 🔢 Liczba projektów na stronie

const ProjektList = () => {
  const [projekty, setProjekty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjekty = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Błąd serwera: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Otrzymano nieprawidłowy format danych.");
        }

        setProjekty(data);
      } catch (err) {
        setError(err.message || "Nie można było pobrać projektów.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjekty();
  }, [navigate]);

  const totalPages = Math.ceil(projekty.length / pageSize);
  const visibleProjects = projekty.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handleProjektClick = (projektId) => {
    navigate(`/projekty/${projektId}`);
  };

  const handleAddProjekt = () => {
    navigate("/projekty/nowy");
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Twoje Projekty</h1>
        <button className="add-button" onClick={handleAddProjekt}>
          + Nowy projekt
        </button>
      </div>

      {error && <p className="error-message">Błąd: {error}</p>}

      <div className="projekt-grid">
        {loading
          ? Array.from({ length: pageSize }).map((_, index) => <SkeletonCard key={index} />)
          : visibleProjects.map((projekt) => (
              <div
                key={projekt.projektId}
                className="projekt-card"
                onClick={() => handleProjektClick(projekt.projektId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleProjektClick(projekt.projektId)
                }
              >
                <h3 className="card-title">{projekt.nazwa}</h3>
                <p className="card-description">
                  {projekt.opis || "Brak opisu. Kliknij, aby zobaczyć szczegóły."}
                </p>
              </div>
            ))}
      </div>

      {!loading && !error && projekty.length === 0 && (
        <div className="empty-state">
          <h2>Brak projektów</h2>
          <p>Wygląda na to, że nie masz jeszcze żadnych projektów.</p>
          <button className="add-button" onClick={handleAddProjekt}>
            Stwórz swój pierwszy projekt
          </button>
        </div>
      )}

      {!loading && projekty.length > pageSize && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 0}>
            ◀ Poprzednia
          </button>
          <span>
            Strona {currentPage + 1} z {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
            Następna ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjektList;
