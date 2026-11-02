
const express = require('express');
const router = express.Router();

const controlador = require('../controllers/productoController');
const verificarToken = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', controlador.listar);
router.get('/:id', controlador.obtener);

// Rutas protegidas con JWT
router.post('/', verificarToken, controlador.crear);
router.put('/:id', verificarToken, controlador.actualizar);
router.delete('/:id', verificarToken, controlador.eliminar);

module.exports = router;
