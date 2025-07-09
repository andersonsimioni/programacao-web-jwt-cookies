import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EditTokenData.css';
import { getTokenData, updateTokenData } from '../services/api';

export default function EditTokenData() {
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    preferences: ''
  });

  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchToken() {
      try {
        const data = await getTokenData();
        const jwtData = data.token || {};

        setFormData({
          name: jwtData.name || '',
          avatar: jwtData.avatar || '',
          preferences: jwtData.preferences
            ? JSON.stringify(jwtData.preferences, null, 2)
            : ''
        });
      } catch (e) {
        console.error('Erro ao buscar token da API:', e);
        setMsg('❌ Erro ao buscar token da API');
      } finally {
        setLoading(false);
      }
    }

    fetchToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('🔄 Atualizando...');

    try {
      const payload = {
        ...formData,
        preferences: formData.preferences
          ? JSON.parse(formData.preferences)
          : undefined
      };

      const res = await updateTokenData(payload);

      if (res.user) {
        setMsg('✅ Informações atualizadas com sucesso!');
      } else {
        setMsg(`❌ ${res.message || 'Erro ao atualizar'}`);
      }
    } catch {
      setMsg('❌ Erro no envio (verifique se o JSON está correto)');
    }
  };

  return (
    <div className="edit-token-wrapper">
      <div className="edit-token-page">
        <Link to="/" className="edit-token-back">⬅️ Voltar para o início</Link>
        <h2 className="edit-token-title">⚙️ Editar Informações do Token</h2>

        {loading ? (
          <p>Carregando dados do token...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
            />

            <label htmlFor="avatar">Avatar (URL):</label>
            <input
              type="text"
              id="avatar"
              name="avatar"
              placeholder="https://meusite.com/avatar.png"
              value={formData.avatar}
              onChange={handleChange}
            />

            <label htmlFor="preferences">Preferências (JSON):</label>
            <textarea
              id="preferences"
              name="preferences"
              placeholder='{"theme": "dark", "lang": "pt-BR"}'
              value={formData.preferences}
              onChange={handleChange}
            />

            <button className="edit-token-btn" type="submit">
              Salvar Alterações
            </button>
          </form>
        )}

        {msg && (
          <div className="edit-token-response">{msg}</div>
        )}
      </div>
    </div>
  );
}
