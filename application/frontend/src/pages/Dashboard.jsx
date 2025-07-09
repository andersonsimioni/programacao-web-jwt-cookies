import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">

        <h2 className="dashboard-title">🎉 Bem-vindo(a)</h2>
        <p className="dashboard-email">{user.email}</p>
        <p className="dashboard-role"><strong>Role:</strong> {user.role}</p>

        <div className="dashboard-buttons">
          <Link to="/log-cookies" className="dashboard-btn secondary">📤 Log de Cookies</Link>
          <Link to="/cookies-db" className="dashboard-btn primary">🗃️ Banco de Cookies</Link>
          
          <Link to="/edit-credentials" className="dashboard-btn secondary">✏️ Editar E-mail/Senha</Link>
          <Link to="/edit-token-data" className="dashboard-btn secondary">⚙️ Editar Token JWT</Link>

          <button onClick={handleLogout} className="dashboard-btn danger">🚪 Sair</button>
        </div>
      </div>
    </div>
  );
}
