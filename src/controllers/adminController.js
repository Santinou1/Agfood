const Pedido = require('../models/Pedido');

// Mostrar la vista del panel de administración
exports.adminPanel = (req, res) => {
    res.render('adminPanel'); // Renderiza la vista del panel de admin
};

// Renderizar la vista de inicio de sesión
exports.showLogin = (req, res) => {
    res.render('adminLogin'); // Renderiza la vista de inicio de sesión
};

// Manejar el inicio de sesión
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Comprobar las credenciales
    if (email === 'yael@gmail.com' && password === '123456') {
        req.session.user = email; // Guardar el email del usuario en la sesión
        return res.redirect('/admin'); // Redirigir al panel de administración
    } else {
        return res.send('Credenciales incorrectas. <a href="/admin/login">Intenta de nuevo</a>');
    }
};
