
const express = require('express');
const router = express.Router();

const controlador = require('../controllers/authController');

// Registrar una cuenta
router.post('/registro', controlador.registro);

// Iniciar sesión
router.post('/login', controlador.login);

module.exports = router;
