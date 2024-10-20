const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController'); // Importar el controlador de usuarios
const authMiddleware = require('../middleware/authMiddleware'); // Importar el middleware de autenticación


// Ruta para renderizar el EJS
router.get('/crear', authMiddleware,  (req, res) => {
    res.render('crearUsuario'); 
});

// Ruta para crear un nuevo usuario (POST)
router.post('/crear', usuarioController.crearUsuario);

// Ruta para listar todos los usuarios (GET)
router.get('/listar', usuarioController.listarUsuarios);


// Ruta para actualizar el email y/o contraseña de un usuario (PUT)
router.post('/actualizar/:id', usuarioController.actualizarUsuario);

router.get('/actualizar/:id', usuarioController.renderizarActualizarUsuario);


// Ruta para eliminar un usuario por el id (DELETE)
router.delete('/eliminar/:id', usuarioController.eliminarUsuario);

// Ruta para altenar estado de un usuario
router.post('/alternar/:id', usuarioController.alternarEstadoUsuario); 


module.exports = router;
