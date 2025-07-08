const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const CookieLog = require('../models/CookieLog');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d'; // Configuravel
const SALT_ROUNDS = 10;

// Gerar JWT
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// REGISTER
exports.register = async (req, res) => {
  console.log("Register");
  const { email, password, role = 'user' } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'E-mail já cadastrado' });
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = new User({ email, password: hashedPassword, role });
  await user.save();

  const token = generateToken({ userId: user._id, role: user.role });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    message: 'Cadastro realizado com sucesso',
    user: { email: user.email, role: user.role }
  });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  // Comparar senha com hash
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = generateToken({ userId: user._id, role: user.role });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    message: 'Login realizado com sucesso',
    user: { email: user.email, role: user.role }
  });
};

// ME
exports.me = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Não autenticado' });

  const user = await User.findById(req.user.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  res.json(user);
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });

  res.json({ message: 'Logout realizado com sucesso' });
};
