import { useState, useEffect } from 'react';
import { getTokenData, logCookies } from '../services/api';
import './CookiesLog.css';
import './Style.css';
import { Link } from 'react-router-dom';

export default function CookiesLog() {
  const [cookies, setCookies] = useState('');
  const [docCookie, setDocCookie] = useState('');
  const [jwtDecoded, setJwtDecoded] = useState('');
  const [apiResponse, setApiResponse] = useState('');

  useEffect(() => {
    updateCookies();
  }, []);

  const updateCookies = async (data) => {
    try
    {
      const aux = await getTokenData();
      setJwtDecoded(JSON.stringify(aux, null, 2));

      setDocCookie(document.cookie);
      setCookies(JSON.stringify(data.log.cookies, null, 2));
      
    }
    catch
    {
      setCookies("Aguardando envio..");
    }
  };

  const handleLog = async () => {
    try {
      const data = await logCookies();      
      setApiResponse(JSON.stringify(data.log, null, 2));
      updateCookies(data);
    } catch {
      setApiResponse('Erro ao enviar para a API');
    }
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
          <h4>🍪 Cookies (document.cookie API)</h4>
          <pre>{docCookie}</pre>
        </div>

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
