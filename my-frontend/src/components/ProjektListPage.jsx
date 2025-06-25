// Użyj tego kodu, który stworzyliśmy wcześniej dla listy projektów z kafelkami i skeleton loaderem.
// Jeśli go nie masz, oto jego uproszczona, ale wciąż profesjonalna wersja.
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjektList.css'; // Ten sam plik co w poprzedniej odpowiedzi

const API_URL = "http://localhost:8080/api/projekty";

const SkeletonCard = () => <div className="projekt-card skeleton"></div>;

const ProjektListPage = () => {
  const [projekty, setProjekty] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjekty = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Błąd pobierania');
        const data = await response.json();
        setProjekty(data.content || data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjekty();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Projekty</h1>
        <button className="add-button" onClick={() => navigate('/projekty/nowy')}>
          + Nowy projekt
        </button>
      </div>
      <div className="projekt-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          projekty.map((projekt) => (
            <div
              key={projekt.projektId}
              className="projekt-card"
              onClick={() => navigate(`/projekty/${projekt.projektId}`)}
            >
              <h3>{projekt.nazwa}</h3>
              <p>{projekt.opis || "Brak opisu"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjektListPage;