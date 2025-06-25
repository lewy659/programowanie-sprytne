import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [nrIndeksu, setNrIndeksu] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nrIndeksu, password }),
      });

      if (!response.ok) {
        throw new Error("Błędny login lub hasło");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Zaloguj się</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nr Indeksu</label>
            <input
              type="text"
              value={nrIndeksu}
              onChange={(e) => setNrIndeksu(e.target.value)}
              required
              placeholder="Wprowadź nr indeksu"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Wprowadź hasło"
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Zaloguj
          </button>
        </form>

        <p style={styles.registerText}>
          Nie masz konta?{" "}
          <Link to="/registerPage" style={styles.registerLink}>
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
  },
  container: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "1.8rem",
    color: "#333",
  },
  error: {
    color: "red",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "500",
    fontSize: "0.95rem",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "14px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  registerText: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "0.95rem",
  },
  registerLink: {
    color: "#007BFF",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default Login;
