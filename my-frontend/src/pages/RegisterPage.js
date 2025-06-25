import RegisterForm from '../components/RegisterForm';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (form) => {
    await api.post('/api/auth/register', form);
    navigate('/login');
  };

  return <RegisterForm onRegister={handleRegister} />;
}

export default RegisterPage;
