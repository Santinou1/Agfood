const express = require('express'); // Importar Express
const router = express.Router(); // Crear un enrutador de Express
const adminController = require('../controllers/adminController'); // Importar el controlador de admin
const pedidoController = require('../controllers/pedidoController'); // Importar el controlador de pedidos
const authMiddleware = require('../middleware/authMiddleware'); // Importar el middleware de autenticación

// Renderizar la vista de inicio de sesión
router.get('/login', adminController.showLogin);

// Manejar el inicio de sesión
router.post('/login', adminController.login);

// Ruta para el panel de administración, con middleware de autenticación
router.get('/', authMiddleware, adminController.adminPanel);

// Ruta para buscar pedidos por fecha, con middleware de autenticación
router.get('/pedidos/porFecha', authMiddleware, pedidoController.obtenerPedidosPorFecha);

module.exports = router; // Exportar el enrutador para ser utilizado por la aplicación