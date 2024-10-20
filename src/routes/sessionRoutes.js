const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/sessionController');

// Ruta para el login
router.post('/login', login);

// Ruta para el logout
router.get('/logout', logout);

module.exports = router;