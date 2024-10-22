const Usuario = require('../models/Usuario'); // Importar el modelo Usuario

// Middleware para verificar si el usuario es administrador
const esAdmin = (req, res, next) => {
    // Verificar si el usuario está autenticado mediante la sesión
    if (req.session && req.session.user) {
        // Buscar al usuario en la base de datos por su email almacenado en la sesión
        Usuario.findOne({ mail: req.session.user })
            .then(usuario => {
                if (!usuario) {
                    return res.redirect('/'); // Si el usuario no existe, redirigir a la página de login
                }

                // Verificar si el rol del usuario es "admin"
                if (usuario.rol === 'admin') {
                    return next(); // Si el usuario es admin, permitir el acceso
                } else {
                    // Si el rol no es admin, bloquear el acceso con un código de error 403
                    return res.send(`
                        <h2>Acceso denegado</h2>
                        <p>No sos administrador para visualizar el contenido</p>
                        <button onclick="window.location.href='/'">Volver a Iniciar Sesión</button>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                text-align: center;
                                margin-top: 50px;
                            }
                            button {
                                padding: 10px 15px;
                                background-color: #007BFF;
                                color: white;
                                border: none;
                                cursor: pointer;
                                border-radius: 5px;
                                margin-top: 20px;
                            }
                            button:hover {
                                background-color: #0056b3;
                            }
                        </style>
                    `);
                }
            })
            .catch(err => {
                console.error('Error al buscar el usuario:', err);
                return res.redirect('/'); // En caso de error, redirigir a la página de inicio
            });
    } else {
        // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
        return res.redirect('/');
    }
};

module.exports = esAdmin; // Exportar el middleware
