const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

// Carregar variáveis do .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://cookies.wyllian.bs.vms.ufsc.br'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir chamadas sem origem (ex: curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origem não permitida pelo CORS'));
  },
  credentials: true
}));

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado com sucesso'))
  .catch(err => console.error(`Erro ao conectar em ${process.env.MONGODB_URI} no MongoDB:`, err));

// Rotas
const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

// Rota raiz para teste
app.get('/', (req, res) => {
  console.log(req.url);
  res.send('API de Autenticação com Cookies e JWT');
});

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em https://localhost:${PORT}`);
});
