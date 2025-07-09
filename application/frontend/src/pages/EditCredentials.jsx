import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './EditCredentials.css';
import { updateUser } from '../services/api';

export default function EditCredentials() {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('🔄 Atualizando...');

    try {
      const body = {};
      if (email) body.email = email;
      if (password) body.password = password;

      const res = await updateUser(body);

      if (res.user) {
        setMsg('✅ Dados atualizados com sucesso!');
      } else {
        setMsg(`❌ ${res.message || 'Erro desconhecido'}`);
      }
    } catch {
      setMsg('❌ Erro ao atualizar dados');
    }
  };

  return (
    <div className="edit-cred-wrapper">
      <div className="edit-cred-page">
        <Link to="/" className="edit-cred-back">⬅️ Voltar para o início</Link>
        <h2 className="edit-cred-title">✏️ Editar E-mail e Senha</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Novo e-mail (opcional)"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Nova senha (opcional)"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="edit-cred-btn">
            Salvar alterações
          </button>
        </form>

        {msg && (
          <div className="edit-cred-response">{msg}</div>
        )}
      </div>
    </div>
  );
}
