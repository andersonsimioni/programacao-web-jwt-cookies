const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const logController = require('../controllers/logController');

//Autenticação
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/register', authController.register);
router.get('/me', authMiddleware, authController.me);

//Logs de Cookies
router.get('/log-cookies', logController.logCookies);
router.get('/cookies-db', logController.getAllCookies);

module.exports = router;
