import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSortAlphaDown, FaSortAlphaUp, FaFilter } from 'react-icons/fa';
import './ProjektList.css';

const API_URL = "http://localhost:8080/api/projekty";

const SkeletonCard = () => <div className="projekt-card skeleton"></div>;

const ProjektListPage = () => {
  const [projekty, setProjekty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nazwa');
  const [sortOrder, setSortOrder] = useState('asc');

  // --- Nowe: Paginacja ---
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  // ------------------------

  useEffect(() => {
    const fetchProjekty = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Brak tokenu JWT. Zaloguj się ponownie.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Nieznany błąd.' }));
          throw new Error(errorData.message || 'Błąd pobierania projektów.');
        }
        const data = await response.json();
        setProjekty(data.content || data);
      } catch (err) {
        console.error("Błąd pobierania projektów:", err);
        setError(err.message || "Nie udało się załadować projektów.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjekty();
  }, [navigate]);

  const filteredAndSortedProjekty = useMemo(() => {
    let currentProjekty = [...projekty];

    if (searchTerm) {
      currentProjekty = currentProjekty.filter(projekt =>
        projekt.nazwa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (projekt.opis && projekt.opis.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    currentProjekty.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'nazwa') {
        comparison = a.nazwa.localeCompare(b.nazwa);
      } else if (sortBy === 'dataUtworzenia') {
        comparison = new Date(a.dataUtworzenia) - new Date(b.dataUtworzenia);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return currentProjekty;
  }, [projekty, searchTerm, sortBy, sortOrder]);

  // --- Paginacja: dzielenie danych na strony ---
  const paginatedProjekty = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedProjekty.slice(start, start + pageSize);
  }, [filteredAndSortedProjekty, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedProjekty.length / pageSize);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="projekt-list-page">
      <div className="page-header">
        <h1 className="page-title">Projekty</h1>
        <button className="add-button" onClick={() => navigate('/projekty/nowy')}>
          <FaPlus /> Nowy projekt
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="filter-sort-panel">
        <div className="filter-group">
          <FaFilter className="icon" />
          <input
            type="text"
            placeholder="Szukaj projektu..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="filter-input"
          />
        </div>

        <div className="sort-group">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="nazwa">Sortuj wg Nazwy</option>
            <option value="dataUtworzenia">Sortuj wg Daty Utworzenia</option>
          </select>
          <button onClick={toggleSortOrder} className="sort-order-button">
            {sortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
          </button>
        </div>
      </div>

      <div className="projekt-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : paginatedProjekty.length > 0 ? (
          paginatedProjekty.map((projekt) => (
            <div
              key={projekt.projektId}
              className="projekt-card"
              onClick={() => navigate(`/projekty/${projekt.projektId}`)}
            >
              <h3>{projekt.nazwa}</h3>
              <p>{projekt.opis || "Brak opisu"}</p>
              {projekt.dataUtworzenia && (
                <p className="card-date">
                  Utworzono: {new Date(projekt.dataUtworzenia).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="no-results">Brak projektów spełniających kryteria.</p>
        )}
      </div>

      {/* --- Kontrolki paginacji --- */}
      {!loading && totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
            Poprzednia
          </button>
          <span>Strona {currentPage} z {totalPages}</span>
          <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
            Następna
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjektListPage;
