const express = require('express'); // Importar Express para manejar rutas
const router = express.Router(); // Crear un enrutador de Express
const pedidoController = require('../controllers/pedidoController'); // Importar el controlador de pedidos
const authMiddleware = require('../middleware/authMiddleware'); // Importar el middleware de autenticación
const emailController = require('../controllers/emailController');
const esAdmin = require('../middleware/esAdmin');


// Ruta para renderizar el EJS
router.get('/buscar', authMiddleware,esAdmin,  (req, res) => {
    res.render('buscarPedidos'); // Renderiza la plantilla para ingresar la fecha
});


// Rutas para gestionar pedidos
router.post('/guardarPedido', pedidoController.guardarPedido); // Ruta para guardar un nuevo pedido (POST)

// Ruta para renderizar la vista con pedidos por fecha (GET)
router.get('/porFecha/:fecha',authMiddleware,esAdmin, pedidoController.obtenerPedidosPorFecha);

// Ruta para descargar el archivo Excel con pedidos para una fecha específica (GET)
router.get("/descargarExcel/:fecha",authMiddleware,esAdmin, pedidoController.exportarPedidosExcel);

// Ruta para enviar el correo
router.get('/enviarMail',esAdmin, authMiddleware, emailController.enviarCorreoConExcel); // Usar el controlador para enviar correo



module.exports = router; // Exportar el enrutador para ser utilizado por la aplicación





