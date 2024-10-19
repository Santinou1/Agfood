const Usuario = require('../models/Usuario'); // Importar el modelo Usuario

// Función para mostrar la vista del panel de administración
const adminPanel = (req, res) => {
    res.render('adminPanel'); // Renderiza la vista del panel de admin
};

// Función para renderizar la vista de inicio de sesión
const showLogin = (req, res) => {
    res.render('adminLogin'); // Renderiza la vista de inicio de sesión
};

// Función para manejar el inicio de sesión
const login = (req, res) => {
    const { email, password } = req.body;

    // Comprobar las credenciales en la base de datos
    Usuario.findOne({ mail: email }) // Buscar al usuario por email
        .then(usuario => {
            if (!usuario) {
                return res.send('Credenciales incorrectas. <a href="/admin/login">Intenta de nuevo</a>');
            }

            // Comparar la contraseña
            return usuario.compararContraseña(password).then(isMatch => {
                if (!isMatch) {
                    return res.send('Credenciales incorrectas. <a href="/admin/login">Intenta de nuevo</a>');
                }

                // Verificar el rol del usuario
                if (usuario.rol === 'admin') {
                    req.session.user = email; // Guardar el email del usuario en la sesión
                    return res.redirect('/admin'); // Redirigir al panel de administración
                } else {
                    return res.send('No tienes permisos para acceder al panel de administración.'); // Manejar acceso no permitido
                }
            });
        })
        .catch(err => {
            console.error(err); // Log del error
            return res.status(500).send('Error al intentar iniciar sesión.'); // Manejar error en la consulta
        });
};

// Exportar las funciones utilizando module.exports
module.exports = {
    adminPanel,
    showLogin,
    login
};
