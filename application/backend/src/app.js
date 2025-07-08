const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

// Carrega variáveis de ambiente
dotenv.config();

// Valores padrão caso .env não esteja carregado corretamente
const PORT = process.env.PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'chave_super_secreta';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cookiesapp';

// Inicializa o app
const app = express();

// Middlewares globais
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://cookies.wyllian.bs.vms.ufsc.br',
  'https://localhost:5173',
  'https://localhost:3000',
  'https://cookies.wyllian.bs.vms.ufsc.br'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman, curl etc
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origem não permitida pelo CORS'));
  },
  credentials: true
}));

// Conexão com MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado com sucesso'))
  .catch(err => console.error(`❌ Erro ao conectar em ${MONGODB_URI} no MongoDB:`, err));

// Rotas
const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

// Rota de teste
app.get('/', (req, res) => {
  console.log(req.url);
  res.send('API de Autenticação com Cookies e JWT');
});

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em https://localhost:${PORT}`);
});
