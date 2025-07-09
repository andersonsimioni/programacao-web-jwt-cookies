const CookieLog = require('../models/CookieLog');
const jwt = require('jsonwebtoken');

exports.logCookies = async (req, res) => {
  try {
    const cookies = Object.entries(req.cookies || {}).map(([name, value]) => ({
      name,
      value,
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/',
      expires: null
    }));

    let decodedJWT = null;
    const jwtRaw = req.cookies.jwt;

    if (jwtRaw) {
      try {
        decodedJWT = jwt.verify(jwtRaw, process.env.JWT_SECRET);
      } catch (err) {
        decodedJWT = { erro: 'JWT inválido' };
      }
    }

    const log = await CookieLog.create({
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      cookies,
      decodedJWT
    });

    res.json({
      message: 'Cookies registrados com sucesso',
      log,
      userData: decodedJWT && typeof decodedJWT === 'object' ? {
        name: decodedJWT.name || '',
        avatar: decodedJWT.avatar || '',
        preferences: decodedJWT.preferences || {},
        role: decodedJWT.role,
        userId: decodedJWT.userId
      } : {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar cookies' });
  }
};

exports.getAllCookies = async (req, res) => {
  try {
    const logs = await CookieLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
};
