import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FaTasks, FaUsers, FaPlus, FaSearch, FaUserPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { debounce } from "lodash";
import "./ProjektDetails.css";

const API_BASE_URL = "http://localhost:8080/api";

function ProjektDetails() {
  const { id } = useParams();
  const [projekt, setProjekt] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edytowanie projektu
  const [isEditingProjekt, setIsEditingProjekt] = useState(false);
  const [editNazwa, setEditNazwa] = useState("");
  const [editOpis, setEditOpis] = useState("");

  const [newZadanieName, setNewZadanieName] = useState("");
  const [isSubmittingZadanie, setIsSubmittingZadanie] = useState(false);

  const [studentSearch, setStudentSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingStudents, setIsSearchingStudents] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  const [przypisywanieZadaniaId, setPrzypisywanieZadaniaId] = useState(null);
  const [studentDoPrzypisania, setStudentDoPrzypisania] = useState("");

  const fetchProjektDetails = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Brak autoryzacji. Proszę się zalogować.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projekty/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Nie udało się wczytać danych projektu.");
      const data = await response.json();
      setProjekt(data);
      setEditNazwa(data.nazwa);
      setEditOpis(data.opis || "");
    } catch (err) {
      toast.error(err.message);
      setProjekt(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchProjektDetails();
  }, [fetchProjektDetails]);

  const fetchStudentSuggestions = useCallback(
    async (query) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsSearchingStudents(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/studenci?imie=${encodeURIComponent(query)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Błąd podczas wyszukiwania studentów.");
        const data = await response.json();
        const currentStudentIds = new Set(projekt?.studenci?.map((s) => s.studentId) || []);
        setSuggestions(data.filter((s) => !currentStudentIds.has(s.studentId)));
      } catch (err) {
        toast.error(err.message);
        setSuggestions([]);
      } finally {
        setIsSearchingStudents(false);
      }
    },
    [projekt]
  );

  const debouncedSearch = useCallback(debounce(fetchStudentSuggestions, 300), [fetchStudentSuggestions]);

  useEffect(() => {
    debouncedSearch(studentSearch);
    return () => debouncedSearch.cancel();
  }, [studentSearch, debouncedSearch]);

  const handleDodajZadanie = async (e) => {
    e.preventDefault();
    if (!newZadanieName.trim()) {
      toast.error("Nazwa zadania jest wymagana.");
      return;
    }

    setIsSubmittingZadanie(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/zadania`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ nazwa: newZadanieName, projekt: { projektId: Number(id) } }),
      });
      if (!response.ok) throw new Error("Nie udało się dodać zadania.");
      toast.success("Zadanie dodane!");
      setNewZadanieName("");
      fetchProjektDetails();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmittingZadanie(false);
    }
  };

  const handleUsuńZadanie = async (zadanieId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć to zadanie?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/zadania/${zadanieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Nie udało się usunąć zadania.");
      toast.success("Zadanie usunięte!");
      fetchProjektDetails();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDodajStudenta = async (studentId) => {
    setIsAddingStudent(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/projekty/${id}/dodaj-studenta/${studentId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Nie udało się dodać studenta.");
      toast.success("Student dodany do projektu!");
      setStudentSearch("");
      setSuggestions([]);
      fetchProjektDetails();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleUsunStudentaZProjektu = async (studentId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć studenta z projektu?")) return;

	try {
	  const token = localStorage.getItem("token");
	  const response = await fetch(`${API_BASE_URL}/projekty/${id}/usun-studenta/${studentId}`, {
	    method: "DELETE",
	    headers: { Authorization: `Bearer ${token}` },
	  });

	  if (!response.ok) throw new Error("Nie udało się usunąć studenta.");

	  toast.success("Student został usunięty z projektu!");
	  fetchProjektDetails();  // odśwież dane projektu po usunięciu
	} catch (err) {
	  toast.error(err.message);
	}
  };

  const handlePrzypiszStudentaDoZadania = async (zadanieId, studentId) => {
    if (!studentId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/zadania/${zadanieId}/student/${studentId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Nie udało się przypisać studenta.");
      toast.success("Student przypisany do zadania!");
      fetchProjektDetails();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Zapisz zmiany edycji projektu
  const handleSaveProjekt = async () => {
    if (!editNazwa.trim()) {
      toast.error("Nazwa projektu jest wymagana.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/projekty/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projekt,
          nazwa: editNazwa.trim(),
          opis: editOpis.trim(),
        }),
      });
      if (!response.ok) throw new Error("Nie udało się zapisać zmian projektu.");
      const updatedProjekt = await response.json();
      setProjekt(updatedProjekt);
      toast.success("Projekt zaktualizowany!");
      setIsEditingProjekt(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return <div className="page-container">Ładowanie...</div>;
  }

  if (!projekt) {
    return <div className="error-container">Nie udało się załadować projektu lub nie istnieje.</div>;
  }

  return (
    <div className="page-container">
      <Toaster position="bottom-right" />

      <div className="projekt-title-header">
        {isEditingProjekt ? (
          <>
            <input
              type="text"
              value={editNazwa}
              onChange={(e) => setEditNazwa(e.target.value)}
              placeholder="Nazwa projektu"
            />
            <textarea
              value={editOpis}
              onChange={(e) => setEditOpis(e.target.value)}
              placeholder="Opis projektu"
              rows={3}
            />
            <div style={{ marginTop: 8 }}>
              <button onClick={handleSaveProjekt} title="Zapisz zmiany">
                <FaSave /> Zapisz
              </button>
              <button onClick={() => setIsEditingProjekt(false)} style={{ marginLeft: 8 }} title="Anuluj edycję">
                <FaTimes /> Anuluj
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>{projekt.nazwa}</h1>
            <p>{projekt.opis || "Ten projekt nie ma jeszcze opisu."}</p>
            <button onClick={() => setIsEditingProjekt(true)} title="Edytuj projekt" style={{ marginTop: 8 }}>
              <FaEdit /> Edytuj
            </button>
          </>
        )}
      </div>

      <div className="details-layout">
        <main className="main-content">
          <div className="details-card">
            <h3 className="card-header">
              <FaTasks /> Zadania
            </h3>
            <ul className="item-list">
              {projekt.zadania?.length > 0 ? (
                projekt.zadania.map((z) => (
                  <li key={z.zadanieId} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flexGrow: 1 }}>
                      <strong>{z.nazwa}</strong>
                      {z.student && (
                        <div className="assigned-info">
                          <small>
                            Przypisany: {z.student.imie} {z.student.nazwisko}
                          </small>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        className="assign-btn"
                        onClick={() =>
                          przypisywanieZadaniaId === z.zadanieId
                            ? setPrzypisywanieZadaniaId(null)
                            : setPrzypisywanieZadaniaId(z.zadanieId)
                        }
                        title="Przypisz studenta"
                      >
                        <FaUserPlus />
                      </button>
                      <button
                        className="assign-btn"
                        onClick={() => handleUsuńZadanie(z.zadanieId)}
                        title="Usuń zadanie"
                        style={{ color: "red", marginLeft: "8px" }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {przypisywanieZadaniaId === z.zadanieId && (
                      <select
                        value={studentDoPrzypisania}
                        onChange={(e) => {
                          setStudentDoPrzypisania(e.target.value);
                          if (e.target.value) {
                            handlePrzypiszStudentaDoZadania(z.zadanieId, e.target.value);
                          }
                        }}
                      >
                        <option value="">-- Wybierz studenta --</option>
                        {projekt.studenci?.map((s) => (
                          <option key={s.studentId} value={s.studentId}>
                            {s.imie} {s.nazwisko}
                          </option>
                        ))}
                      </select>
                    )}
                  </li>
                ))
              ) : (
                <p className="empty-list-info">Brak zadań w tym projekcie.</p>
              )}
            </ul>
            <form onSubmit={handleDodajZadanie} className="add-item-form">
              <input
                type="text"
                placeholder="Nowe zadanie..."
                value={newZadanieName}
                onChange={(e) => setNewZadanieName(e.target.value)}
                disabled={isSubmittingZadanie}
              />
              <button type="submit" disabled={isSubmittingZadanie}>
                {isSubmittingZadanie ? <span className="spinner"></span> : <FaPlus />}
              </button>
            </form>
          </div>
        </main>

        <aside className="sidebar">
          <div className="details-card">
            <h3 className="card-header">
              <FaUsers /> Członkowie
            </h3>
            <div className="search-wrapper">
              <input
                type="search"
                placeholder="Dodaj studenta (imię)..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                disabled={isAddingStudent}
              />
              {isSearchingStudents && <div className="spinner small-spinner"></div>}
              {studentSearch && suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((s) => (
                    <li key={s.studentId}>
                      {s.imie} {s.nazwisko}
                      <button
                        onClick={() => handleDodajStudenta(s.studentId)}
                        disabled={isAddingStudent}
                        title="Dodaj do projektu"
                      >
                        <FaPlus />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <ul className="item-list">
              {projekt.studenci?.length > 0 ? (
                projekt.studenci.map((s) => (
                  <li key={s.studentId} className="student-item">
                    {s.imie} {s.nazwisko}
                    <button
                      onClick={() => handleUsunStudentaZProjektu(s.studentId)}
                      title="Usuń studenta z projektu"
                      style={{ color: "red", marginLeft: 8 }}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))
              ) : (
                <p className="empty-list-info">Brak studentów przypisanych do projektu.</p>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ProjektDetails;
