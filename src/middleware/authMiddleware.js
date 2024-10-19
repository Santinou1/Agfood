const Usuario = require('../models/Usuario'); // Importar el modelo Usuario

// Middleware para verificar la autenticación del usuario
const authMiddleware = (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (req.session && req.session.user) {
        // Buscar al usuario en la base de datos
        Usuario.findOne({ mail: req.session.user })
            .then(usuario => {
                if (usuario && usuario.rol === 'admin') {
                    return next(); // Si el usuario es admin, continuar
                } else {
                    return res.redirect('/admin/login'); // Si no es admin, redirigir a login
                }
            })
            .catch(err => {
                console.error(err); // Log del error
                return res.redirect('/admin/login'); // Manejar error en la consulta
            });
    } else {
        // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
        return res.redirect('/admin/login');
    }
};

module.exports = authMiddleware; // Exportar el middleware
