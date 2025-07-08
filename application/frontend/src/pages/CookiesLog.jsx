import { useState, useEffect } from 'react';
import { logCookies } from '../services/api';
import './CookiesLog.css';
import './Style.css';
import { Link } from 'react-router-dom';

export default function CookiesLog() {
  const [cookies, setCookies] = useState('');
  const [jwtDecoded, setJwtDecoded] = useState('');
  const [apiResponse, setApiResponse] = useState('');

  useEffect(() => {
    updateCookies();
  }, []);

  const updateCookies = () => {
    const cookieString = document.cookie || 'Nenhum cookie';
    setCookies(cookieString);
    
    // buscar o cookie chamado token
    const tokenCookie = cookieString
      .split('; ')
      .find((c) => c.startsWith('token='));

    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      try {
        const payload = token.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(
          decodeURIComponent(
            escape(window.atob(base64))
          )
        );
        setJwtDecoded(JSON.stringify(decoded, null, 2));
      } catch {
        setJwtDecoded('Erro ao decodificar JWT');
      }
    } else {
      setJwtDecoded('Nenhum JWT encontrado');
    }
  };

  const handleLog = async () => {
    try {
      const data = await logCookies();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch {
      setApiResponse('Erro ao enviar para a API');
    }

    updateCookies();
  };

  return (
    <div className="log-wrapper">
      <div className="log-page">
        <Link to="/" className="back-btn">⬅️ Voltar para o início</Link>
        <h2 className="log-title">📤 Log de Cookies</h2>

        <button className="log-btn" onClick={handleLog}>
          Enviar cookies para o servidor
        </button>

        <div className="log-card">
          <h4>🍪 Cookies</h4>
          <pre>{cookies}</pre>
        </div>

        <div className="log-card">
          <h4>📄 JWT Decodificado</h4>
          <pre>{jwtDecoded}</pre>
        </div>

        <div className="log-card">
          <h4>📬 Resposta da API</h4>
          <pre>{apiResponse || 'Ainda não enviado'}</pre>
        </div>
      </div>
    </div>
  );
}
