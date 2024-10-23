const express = require('express'); // Importar Express
const router = express.Router(); // Crear un enrutador de Express
const adminController = require('../controllers/adminController'); // Importar el controlador de admin
const pedidoController = require('../controllers/pedidoController'); // Importar el controlador de pedidos
const authMiddleware = require('../middleware/authMiddleware'); // Importar el middleware de autenticación
const esAdmin = require('../middleware/esAdmin');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });



// Ruta para renderizar la vista de subir Excel
router.get('/subir-excel',authMiddleware,esAdmin, (req, res) => {
    res.render('subirExcel'); // Renderiza la nueva vista
});

// Ruta para el panel de administración, con middleware de autenticación
router.get('/', authMiddleware,esAdmin, adminController.adminPanel);

// Ruta para buscar pedidos por fecha, con middleware de autenticación
router.get('/pedidos/porFecha', authMiddleware,esAdmin, pedidoController.obtenerPedidosPorFecha);

// Ruta para cargar el archivo Excel
router.post('/cargar-excel',esAdmin,authMiddleware, upload.single('archivoExcel'), adminController.processExcelUpload)

module.exports = router; // Exportar el enrutador para ser utilizado por la aplicación