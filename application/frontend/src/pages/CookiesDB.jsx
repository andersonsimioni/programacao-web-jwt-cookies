import { useEffect, useState } from 'react';
import { getCookiesDB } from '../services/api';
import './CookiesDB.css';
import './Style.css';
import { Link } from 'react-router-dom';


export default function CookiesDB() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCookiesDB().then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="cookiesdb-wrapper">
        <p className="cookiesdb-loading">⏳ Carregando logs...</p>
      </div>
    );
  }

  return (
    <div className="cookiesdb-wrapper">
      <div className="cookiesdb-page">
        <Link to="/" className="back-btn">⬅️ Voltar para o início</Link>
        <h2 className="cookiesdb-title">🗃️ Banco de Logs de Cookies</h2>

        {logs.length === 0 && <p className="cookiesdb-empty">Nenhum log encontrado.</p>}

        {logs.map((log, index) => (
          <div key={log._id || index} className="cookiesdb-card">
            <h6 className="cookiesdb-timestamp">📅 {new Date(log.timestamp).toLocaleString()}</h6>
            <p><strong>🌐 IP:</strong> {log.ip}</p>
            <p><strong>🧠 JWT:</strong></p>
            <pre className="cookiesdb-block">{JSON.stringify(log.decodedJWT || 'Nenhum', null, 2)}</pre>
            <p><strong>🍪 Cookies:</strong></p>
            <pre className="cookiesdb-block">
              {(log.cookies || []).map(c => `${c.name}=${c.value}`).join('\n')}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
