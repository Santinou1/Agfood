const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario'); // Asegúrate de que el modelo Usuario esté correctamente importado

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

              // Guardar el email y rol del usuario en la sesión
              req.session.user = { email, rol: usuario.rol }; 

              // Redirigir según el rol del usuario
              if (usuario.rol === 'admin') {
                  req.session.user = email; // Aquí debería ser solo el email
                  return res.redirect('/admin'); // Redirigir al panel de administración
              } else if (usuario.rol === "usuario") {
                  req.session.user = email; // Aquí también debería ser solo el email
                  return res.redirect('/pedido'); // Redirigir al formulario de pedido
              }else {
                  return res.status(403).send('Rol de usuario no reconocido.'); // Manejar rol no reconocido
              }
          });
      })
      .catch(err => {
          console.error(err); // Log del error
          return res.status(500).send('Error al intentar iniciar sesión.'); // Manejar error en la consulta
      });
};

const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Error al cerrar la sesión.');
      }
      res.redirect('/'); // Redirigir a la página de login después de cerrar sesión
    });
  };

  // Exportar las funciones utilizando module.exports
module.exports = {
    login,
    logout
  };
  