const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas

// Definir el esquema del usuario
const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'usuario'], default: 'usuario' }, // El rol puede ser 'admin' o 'usuario'
    activo: { type: Boolean, default: true } // Usar true sin comillas
});

// Middleware para encriptar la contraseña antes de guardarla (con promesas)
usuarioSchema.pre('save', function (next) {
    if (!this.isModified('contraseña')) return next();

    bcrypt.genSalt(10)
        .then(salt => {
            return bcrypt.hash(this.contraseña, salt);
        })
        .then(hash => {
            this.contraseña = hash;
            next();
        })
        .catch(err => next(err));
});

// Método para comparar contraseñas al iniciar sesión (con promesas)
usuarioSchema.methods.compararContraseña = function (contraseñaIngresada) {
    return bcrypt.compare(contraseñaIngresada, this.contraseña);
};

// Crear el modelo Usuario utilizando el esquema definido
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
