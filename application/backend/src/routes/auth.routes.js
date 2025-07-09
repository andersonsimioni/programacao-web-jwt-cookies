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
router.put('/me', authMiddleware, authController.updateUser);
router.get('/me/token-data', authMiddleware, authController.getTokenData);
router.put('/me/token-data', authMiddleware, authController.updateTokenData);

//Logs de Cookies
router.get('/log-cookies', authMiddleware, logController.logCookies);
router.get('/cookies-db', authMiddleware, logController.getAllCookies);

module.exports = router;
