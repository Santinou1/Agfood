// Middleware para verificar la autenticación del usuario
const authMiddleware = (req, res, next) => {
    // Aquí podrías usar sesiones o cualquier método de autenticación que desees
    if (req.session && req.session.user === 'yael@gmail.com') {
        return next(); // Si el usuario está autenticado, continuar
    }
    // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
    return res.redirect('/admin/login');
};

module.exports = authMiddleware; // Exportar el middleware