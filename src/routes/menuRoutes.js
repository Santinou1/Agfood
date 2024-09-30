const express = require('express'); // Importar Express para manejar rutas
const router = express.Router(); // Crear un enrutador de Express
const menuController = require('../controllers/menuController'); // Importar el controlador del menú

// Definir las rutas y asociarlas a los métodos correspondientes del controlador
router.get('/', menuController.getMenu); // Ruta para obtener el menú (GET)
router.post('/submitOrder', menuController.submitOrder); // Ruta para enviar un pedido (POST)

module.exports = router; // Exportar el enrutador para ser utilizado por la aplicación
