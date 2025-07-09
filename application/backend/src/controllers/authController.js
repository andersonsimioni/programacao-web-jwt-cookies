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

exports.updateUser = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Não autenticado' });

  const { email, password } = req.body;
  const updates = {};

  try {
    if (email) {
      // Verificar se o e-mail já está sendo usado por outro usuário
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.userId) {
        return res.status(409).json({ message: 'E-mail já está em uso por outro usuário' });
      }
      updates.email = email;
    }

    if (password) {
      updates.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      message: 'Usuário atualizado com sucesso',
      user: updatedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

exports.updateTokenData = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Não autenticado' });

  const forbiddenFields = ['_id', 'password', 'role', 'email']; // proteger campos críticos
  const updates = {};
  console.log(req.body);
  for (const [key, value] of Object.entries(req.body)) {
    if (!forbiddenFields.includes(key)) {
      updates[key] = value;
    }
  }
  console.log(updates);

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'Nenhuma informação válida para atualizar' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Novo token com os dados atualizados mais importantes
    const newPayload = {
      userId: updatedUser._id,
      role: updatedUser.role,
      ...updates // inclui as infos customizadas no novo token
    };

    const newToken = generateToken(newPayload);

    res.cookie('jwt', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Informações atualizadas com sucesso',
      user: updatedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar informações' });
  }
};

exports.getTokenData = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado no cookie' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ token: decoded });
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
