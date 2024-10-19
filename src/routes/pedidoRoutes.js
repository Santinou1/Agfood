const express = require('express'); // Importar Express para manejar rutas
const router = express.Router(); // Crear un enrutador de Express
const pedidoController = require('../controllers/pedidoController'); // Importar el controlador de pedidos
const authMiddleware = require('../middleware/authMiddleware'); // Importar el middleware de autenticación


// Ruta para renderizar el EJS
router.get('/buscar', authMiddleware,  (req, res) => {
    res.render('buscarPedidos'); // Renderiza la plantilla para ingresar la fecha
});


// Rutas para gestionar pedidos
router.post('/guardarPedido', pedidoController.guardarPedido); // Ruta para guardar un nuevo pedido (POST)

// Ruta para renderizar la vista con pedidos por fecha (GET)
router.get('/porFecha/:fecha',authMiddleware, pedidoController.obtenerPedidosPorFecha);

// Ruta para descargar el archivo Excel con pedidos para una fecha específica (GET)
router.get("/descargarExcel/:fecha",authMiddleware, pedidoController.exportarPedidosExcel);


module.exports = router; // Exportar el enrutador para ser utilizado por la aplicación





