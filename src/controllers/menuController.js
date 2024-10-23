const Menu = require('../models/Menu'); // Importa el modelo Menu desde la base de datos

// Función para obtener el menú desde la base de datos y enviarlo como respuesta JSON
exports.getMenu = (req, res) => {
    Menu.findOne({})
        .then((menuData) => {
            if (!menuData) {
                return res.status(404).json({ message: 'Menú no encontrado' });
            }
            res.json(menuData); // Devolver los datos del menú como JSON al cliente
        })
        .catch((error) => {
            console.error('Error al obtener el menú:', error);
            res.status(500).json({ message: 'Error al obtener el menú' });
        });
};

// Función para procesar y enviar el pedido recibido
exports.submitOrder = (req, res) => {
    // Extraer datos del cuerpo de la solicitud
    const { nombre, menuDelDia, empanadas, tartas, pastasCocidas, ravioles, salsas } = req.body;
    
    // Aquí iría el procesamiento lógico del pedido, como guardar en una base de datos, enviar notificaciones, etc.

    res.send('Pedido recibido'); // Enviar respuesta al cliente confirmando que el pedido fue recibido
};
