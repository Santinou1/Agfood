const mongoose = require('mongoose');

const archivoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    contenido: { type: Buffer, required: true }, // Guardar el contenido como Buffer
    tipo: { type: String, required: true }, // Tipo de contenido
    fechaCreacion: { type: Date, default: Date.now } // Fecha de creación
});

module.exports = mongoose.model('Archivo', archivoSchema);
