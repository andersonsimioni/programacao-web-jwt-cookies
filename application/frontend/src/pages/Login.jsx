import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/api';
import './Login.css';
import './Style.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('🔄 Autenticando...');

    const res = await login({ email, password });

    if (res.user) {
      setUser(res.user);
      setMsg('✅ Login realizado!');
      setTimeout(() => navigate('/'), 800);
    } else {
      setMsg(`❌ ${res.message || 'Erro ao logar'}`);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">🔐 Login</h2>

        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />

        <button type="submit">Entrar</button>

        <div className="login-links">
          <Link to="/register">Criar conta</Link>
        </div>

        {msg && <pre className="login-message">{msg}</pre>}
      </form>
    </div>
  );
}
