import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext'; 
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { studentId, isLoggedIn } = useAuth(); 

    const [projectCount, setProjectCount] = useState(0);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [errorProjects, setErrorProjects] = useState(null);

    const [recentProjects, setRecentProjects] = useState([]); 

    const [currentUserData, setCurrentUserData] = useState(null); 
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [errorUser, setErrorUser] = useState(null);

    useEffect(() => {
        const fetchStudentProjectsCount = async () => {
            setIsLoadingProjects(true);
            setErrorProjects(null);

            if (!isLoggedIn || !studentId) {
                setProjectCount(0);
                setErrorProjects("Brak ID studenta lub użytkownik nie jest zalogowany.");
                setIsLoadingProjects(false);
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setProjectCount(0);
                setErrorProjects("Brak tokena uwierzytelnienia. Zaloguj się ponownie.");
                setIsLoadingProjects(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/projekty/student/${studentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 204) {
                        setProjectCount(0);
                    } else {
                        const contentType = response.headers.get("content-type");
                        let errorMessage = `Błąd ${response.status}: ${response.statusText}`;
                        if (contentType && contentType.includes("application/json")) {
                            const errorData = await response.json().catch(() => null);
                            errorMessage = errorData?.message || errorMessage;
                        }
                        setErrorProjects(`Nie udało się pobrać liczby projektów: ${errorMessage}`);
                        setProjectCount(0);
                    }
                } else {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const data = await response.json();
                        setProjectCount(data.length);
                    } else {
                        setProjectCount(0);
                        setErrorProjects("Serwer zwrócił dane w nieoczekiwanym formacie.");
                    }
                }
            } catch (err) {
                console.error("Błąd podczas pobierania projektów dla dashboardu:", err);
                setErrorProjects("Wystąpił błąd sieciowy lub inny problem z połączeniem.");
                setProjectCount(0);
            } finally {
                setIsLoadingProjects(false);
            }
        };

        fetchStudentProjectsCount();
    }, [studentId, isLoggedIn]);

    useEffect(() => {
        const loadRecentProjects = () => {
            try {
                const storedProjects = localStorage.getItem('recentProjects');
                if (storedProjects) {
                    setRecentProjects(JSON.parse(storedProjects));
                }
            } catch (error) {
                console.error("Błąd podczas wczytywania ostatnich projektów z Local Storage:", error);
                setRecentProjects([]);
            }
        };

        loadRecentProjects();
    }, []);

    useEffect(() => {
        const fetchUserDataForWelcome = async () => {
            setIsLoadingUser(true);
            setErrorUser(null);
            
            if (!isLoggedIn) {
                setCurrentUserData(null);
                setErrorUser("Użytkownik nie jest zalogowany.");
                setIsLoadingUser(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu autoryzacyjnego');
                }
                
                const response = await fetch('http://localhost:8080/api/auth/current-user', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) {
                    const errorDetail = await response.text().catch(() => 'Nieznany błąd');
                    throw new Error(`Błąd autoryzacji lub serwera: ${response.status} ${response.statusText} - ${errorDetail}`);
                }
                
                const userDataFromApi = await response.json();
                setCurrentUserData(userDataFromApi); 
            } catch (error) {
                console.error('Błąd pobierania danych użytkownika dla powitania:', error);
                setErrorUser(error.message || 'Nie udało się pobrać danych użytkownika.');
                setCurrentUserData({
                    id: null,
                    imie: 'Anonim', // Zmienione z firstName na imie
                    nazwisko: ''   // Zmienione z lastName na nazwisko
                }); 
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchUserDataForWelcome();
    }, [isLoggedIn]); 

    const displayFullName = currentUserData && currentUserData.imie 
        ? `${currentUserData.imie} ${currentUserData.nazwisko || ''}`.trim() 
        : '';

		return (
		       <div>
		           <div className="page-header">
		               <h1 className="page-title">
		                   {isLoadingUser ? (
		                       "Ładowanie..." 
		                   ) : errorUser ? (
		                       `Witaj w systemie!` // Wyświetla ogólne powitanie, jeśli wystąpi błąd
		                   ) : (
		                       `Witaj w systemie, ${displayFullName}!` 
		                   )}
		               </h1>
		           </div>
		           <p style={{fontSize: '1.1rem', color: '#555'}}>
		               Wybierz opcję z menu po lewej stronie, aby rozpocząć pracę.
		           </p>
            <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Twoje Projekty</h2>
                {isLoadingProjects ? (
                    <p>Ładowanie liczby projektów...</p>
                ) : errorProjects ? (
                    <p style={{ color: 'red' }}>{errorProjects}</p>
                ) : (
                    <p className="project-count" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' }}>
                        Należysz do {projectCount} {projectCount === 1 ? 'projektu' : (projectCount >= 2 && projectCount <= 4 ? 'projektów' : 'projektów')}.
                    </p>
                )}
               
            </div>

            <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Ostatnio Odwiedzone Projekty</h2>
                {recentProjects.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {recentProjects.slice(0, 5).map(project => ( 
                            <li key={project.id} style={{ marginBottom: '8px' }}>
                                <Link to={`/projekty/${project.id}`} style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                                    {project.name}
                                </Link>
                                <span style={{ fontSize: '0.9em', color: '#777', marginLeft: '10px' }}>
                                    (Ostatnio: {new Date(project.timestamp).toLocaleDateString()})
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: '#777' }}>Brak ostatnio odwiedzonych projektów.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;