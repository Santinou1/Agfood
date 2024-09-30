const express = require('express'); // Importar Express para manejar rutas
const router = express.Router(); // Crear un enrutador de Express
const pedidoController = require('../controllers/pedidoController'); // Importar el controlador de pedidos

// Rutas para gestionar pedidos
router.post('/guardarPedido', pedidoController.guardarPedido); // Ruta para guardar un nuevo pedido (POST)

// Ruta para renderizar la vista con pedidos por fecha (GET)
router.get('/porFecha/:fecha', pedidoController.obtenerPedidosPorFecha);

// Ruta para descargar el archivo Excel con pedidos para una fecha específica (GET)
router.get("/descargarExcel/:fecha", pedidoController.exportarPedidosExcel);

module.exports = router; // Exportar el enrutador para ser utilizado por la aplicación





