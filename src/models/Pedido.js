const mongoose = require('mongoose'); // Importar Mongoose para la definición del esquema

// Definir el esquema del pedido
const pedidoSchema = new mongoose.Schema({
    nombre: { type: String, required: true }, // Nombre del cliente (requerido)
    menuDelDia: { type: String }, // Opción seleccionada para el menú del día
    empanadas: { type: String }, // Opción seleccionada para empanadas
    tartas: { type: String }, // Opción seleccionada para tartas
    pastasCocidas: { type: String }, // Opción seleccionada para pastas cocidas
    ravioles: { type: String }, // Opción seleccionada para ravioles
    salsas: { type: String }, // Opción seleccionada para salsas
    fecha: { type: Date, default: Date.now }, // Fecha del pedido (por defecto, fecha actual)
    fechaFormateada1: { type: String }, // Fecha formateada en formato personalizado
});

// Crear el modelo Pedido utilizando el esquema definido
const Pedido = mongoose.model('Pedido', pedidoSchema);

// Exportar el modelo Pedido para utilizarlo en otras partes de la aplicación
module.exports = Pedido;
