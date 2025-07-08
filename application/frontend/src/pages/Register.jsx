import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register } from '../services/api';
import './Register.css';
import './Style.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('🔄 Criando conta...');

    const res = await register({ email, password });

    if (res.user) {
      setUser(res.user);
      setMsg('✅ Conta criada com sucesso!');
      setTimeout(() => navigate('/'), 800);
    } else {
      setMsg(`❌ ${res.message || 'Erro ao cadastrar'}`);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-card">
        <h2 className="register-title">🆕 Criar Conta</h2>

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

        <button type="submit">Cadastrar</button>

        <div className="register-links">
          <Link to="/login">Já tenho conta</Link>
        </div>

        {msg && <pre className="register-message">{msg}</pre>}
      </form>
    </div>
  );
}
