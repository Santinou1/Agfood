const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController'); // Importar el controlador de usuarios

// Ruta para crear un nuevo usuario (POST)
router.post('/crear', usuarioController.crearUsuario);

// Ruta para listar todos los usuarios (GET)
router.get('/listar', usuarioController.listarUsuarios);

// Ruta para deshabilitar un usuario (PUT o PATCH)
router.patch('/deshabilitar/:id', usuarioController.deshabilitarUsuario);

// Ruta para actualizar el email y/o contraseña de un usuario (PUT)
router.put('/actualizar/:id', usuarioController.actualizarUsuario);

// Ruta para eliminar un usuario por el id (DELETE)
router.delete('/eliminar/:id', usuarioController.eliminarUsuario);

// Ruta para rehabilitar un usuario
router.put('/rehabilitar/:id', usuarioController.rehabilitarUsuario); 


module.exports = router;
