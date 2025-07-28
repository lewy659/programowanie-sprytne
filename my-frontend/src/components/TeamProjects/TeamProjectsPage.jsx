import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Auth/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { FaPlus, FaSortAlphaDown, FaSortAlphaUp, FaFilter } from 'react-icons/fa';
import '../ProjektList/ProjektList.css'; 

const SkeletonCard = () => <div className="projekt-card skeleton"></div>; 

const TeamProjectsPage = () => {
  const { studentId, isLoggedIn } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nazwa'); 
  const [sortOrder, setSortOrder] = useState('asc'); 

  useEffect(() => {
    const fetchTeamProjects = async () => {
      if (!isLoggedIn || !studentId) {
        setError("Użytkownik nie jest zalogowany lub brak ID studenta.");
        setIsLoading(false);
        navigate('/login'); 
        return;
      }

      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
            setError("Brak tokena uwierzytelnienia. Zaloguj się ponownie.");
            setIsLoading(false);
            navigate('/login'); // Przekieruj na logowanie, jeśli brak tokena
            return;
        }

        const response = await fetch(`http://localhost:8080/api/projekty/student/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });

        if (!response.ok) {
          if (response.status === 204) {
            setProjects([]); 
            setError("Brak projektów, do których jesteś przypisany."); 
            return; 
          }
          
          const contentType = response.headers.get("content-type");
          let errorData = null;
          if (contentType && contentType.includes("application/json")) {
            errorData = await response.json().catch(() => null);
          }
          
          throw new Error(errorData?.message || `Błąd pobierania projektów: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setProjects(data);
          setError(null); 
        } else {
          setProjects([]);
          setError("Serwer nie zwrócił danych w oczekiwanym formacie. Brak projektów, do których jesteś przypisany.");
        }
        
      } catch (err) {
        console.error("Błąd podczas pobierania projektów zespołu:", err);
        setError(err.message || "Nie udało się załadować projektów. Spróbuj ponownie później.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamProjects();
  }, [studentId, isLoggedIn, navigate]); 

  
  const filteredAndSortedProjects = React.useMemo(() => { 
    let currentProjects = [...projects]; 

    // 1. Filtrowanie
    if (searchTerm) {
      currentProjects = currentProjects.filter(projekt =>
        projekt.nazwa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (projekt.opis && projekt.opis.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 2. Sortowanie
    currentProjects.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'nazwa') {
        comparison = a.nazwa.localeCompare(b.nazwa);
      } else if (sortBy === 'dataUtworzenia') {
        const dateA = new Date(a.dataUtworzenia);
        const dateB = new Date(b.dataUtworzenia);
        comparison = dateA - dateB;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return currentProjects;
  }, [projects, searchTerm, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };


  if (isLoading) {
    return (
      <div className="projekt-list-page">
        <h1 className="page-title">Moje Zespoły (Projekty)</h1> {/* Dodaj tytuł */}
        <div className="projekt-grid">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)} {/* Wyświetl mniej szkieletów, bo to projekty studenta */}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="projekt-list-page">
      <div className="page-header">
        <h1 className="page-title">Moje Zespoły (Projekty)</h1>
      </div>

      <div className="filter-sort-panel">
        <div className="filter-group">
          <FaFilter className="icon" />
          <input
            type="text"
            placeholder="Szukaj projektu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        {filteredAndSortedProjects.length === 0 ? (
          <p className="no-results">Nie jesteś jeszcze przypisany do żadnego projektu.</p>
        ) : (
          filteredAndSortedProjects.map((projekt) => (
            <div
              key={projekt.projektId}
              className="projekt-card"
              onClick={() => navigate(`/projekty/${projekt.projektId}`)}
            >
              <h3>{projekt.nazwa}</h3>
              <p>{projekt.opis || "Brak opisu"}</p>
              {projekt.dataUtworzenia && <p className="card-date">Utworzono: {new Date(projekt.dataUtworzenia).toLocaleDateString()}</p>}
            </div>
          ))
        )}
      </div>
      
    </div>
  );
};

export default TeamProjectsPage;