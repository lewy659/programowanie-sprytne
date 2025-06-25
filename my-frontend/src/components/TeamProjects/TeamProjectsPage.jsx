import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Auth/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom'; // Importuj useNavigate
import { FaPlus, FaSortAlphaDown, FaSortAlphaUp, FaFilter } from 'react-icons/fa'; // Importuj ikony
import '../ProjektList/ProjektList.css'; // Zmień import CSS na wspólny plik

const SkeletonCard = () => <div className="projekt-card skeleton"></div>; // Użyj tej samej karty szkieletowej

const TeamProjectsPage = () => {
  const { studentId, isLoggedIn } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Użyj useNavigate

  // --- Nowe stany dla filtrowania i sortowania, skopiowane z ProjektListPage ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nazwa'); // 'nazwa', 'dataUtworzenia'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  // --- Koniec nowych stanów ---

  useEffect(() => {
    const fetchTeamProjects = async () => {
      // Wczesne wyjście, jeśli użytkownik nie jest zalogowany lub brak studentId
      if (!isLoggedIn || !studentId) {
        setError("Użytkownik nie jest zalogowany lub brak ID studenta.");
        setIsLoading(false);
        // Opcjonalnie przekieruj na stronę logowania, jeśli nie ma studentId
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
  }, [studentId, isLoggedIn, navigate]); // Dodaj navigate do zależności

  // --- Logika filtrowania i sortowania (skopiowana z ProjektListPage) ---
  // To jest potrzebne, aby filtrowanie i sortowanie działało na liście projektów studenta
  const filteredAndSortedProjects = React.useMemo(() => { // Użyj useMemo
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
  // --- Koniec logiki filtrowania i sortowania ---

  // Funkcja przełączająca kierunek sortowania
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
    return <div className="error-message">{error}</div>; // Użyj klasy error-message
  }

  return (
    <div className="projekt-list-page">
      <div className="page-header">
        <h1 className="page-title">Moje Zespoły (Projekty)</h1>
        {/* Usunięto przycisk "Nowy projekt", ponieważ na tej stronie pokazujemy tylko przypisane projekty.
            Jeśli chcesz, aby student mógł tworzyć projekty stąd, możesz go przywrócić i dostosować. */}
      </div>

      {/* --- Panel filtrowania i sortowania, skopiowany z ProjektListPage --- */}
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
      {/* --- Koniec panelu filtrowania i sortowania --- */}

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
      {/* Link do wszystkich projektów jest chyba zbędny na stronie z Twoimi projektami, ale zostawiłem jeśli chcesz.
      <Link to="/projekty" className="back-link">Wróć do wszystkich projektów</Link> */}
    </div>
  );
};

export default TeamProjectsPage;