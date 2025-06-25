import React from 'react';
import LoginForm from '../components/LoginForm';
import api from '../api';
import { saveToken } from '../auth';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const res = await api.post('/api/auth/login', credentials);
      saveToken(res.data.token);
      navigate('/projekty');
    } catch (err) {
      alert('Logowanie nie powiodło się. Sprawdź dane i spróbuj ponownie.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '80px',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h2 style={{ marginBottom: '20px' }}>Logowanie</h2>
      <LoginForm onLogin={handleLogin} />

      <p style={{ marginTop: '30px', fontSize: '1rem' }}>
        Nie masz konta?{' '}
        <Link
          to="/registerPage"
          style={{
            color: '#007BFF',
            textDecoration: 'underline',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Zarejestruj się
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
