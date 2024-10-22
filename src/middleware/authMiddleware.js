const Usuario = require('../models/Usuario'); // Importar el modelo Usuario

// Middleware para verificar la autenticación del usuario
const authMiddleware = (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (req.session && req.session.user) {
        // Buscar al usuario en la base de datos
        Usuario.findOne({ mail: req.session.user })
            .then(usuario => {
                if (!usuario) {
                    return res.redirect('/'); // Si el usuario no existe, redirigir a login
                }

                // Verificar el rol del usuario
                if (usuario.rol === 'admin') {
                    return next(); // Si el usuario es admin, continuar
                } else if (usuario.rol === "usuario") {
                    return next(); // Si es usuario, también permitir el acceso (puedes cambiar esto si es necesario)
                } else {
                    return res.status(403).send('Rol de usuario no reconocido.'); // Manejar rol no reconocido
                }
            })
            .catch(err => {
                console.error(err); // Log del error
                return res.redirect('/'); // Manejar error en la consulta
            });
    } else {
        // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
        return res.redirect('/');
    }
};

module.exports = authMiddleware; // Exportar el middleware
