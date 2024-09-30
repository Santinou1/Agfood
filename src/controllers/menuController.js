const menuData = require('../../data/menu.json'); // Importar datos del menú desde un archivo JSON

// Función para obtener el menú y enviarlo como respuesta JSON
exports.getMenu = (req, res) => {
    res.json(menuData); // Devolver los datos del menú como JSON al cliente
};

// Función para procesar y enviar el pedido recibido
exports.submitOrder = (req, res) => {
    // Extraer datos del cuerpo de la solicitud
    const { nombre, menuDelDia, empanadas, tartas, pastasCocidas, ravioles, salsas } = req.body;
    
    // Aquí iría el procesamiento lógico del pedido, como guardar en una base de datos, enviar notificaciones, etc.

    res.send('Pedido recibido'); // Enviar respuesta al cliente confirmando que el pedido fue recibido
};
