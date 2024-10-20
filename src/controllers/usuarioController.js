const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

// Crear un nuevo usuario
function crearUsuario(req, res) {
  const { nombre, apellido, mail, contraseña, rol } = req.body;

  // Verificar si el usuario ya existe por el correo electrónico
  Usuario.findOne({ mail })
    .then((usuarioExistente) => {
      if (usuarioExistente) {
        return res
          .status(400)
          .send("El correo electrónico ya está registrado.");
      }

      // Crear el nuevo usuario
      const nuevoUsuario = new Usuario({
        nombre,
        apellido,
        mail,
        contraseña,
        rol,
      });

      // Guardar el nuevo usuario en la base de datos
      nuevoUsuario
        .save()
        .then(() => res.redirect("/api/usuarios/listar")) // Redirige al listado de usuarios
        .catch((err) =>
          res.status(500).send("Error al crear el usuario: " + err)
        );
    })
    .catch((err) => res.status(500).send("Error al buscar usuario: " + err));
}

// Listar todos los usuarios
const listarUsuarios = (req, res) => {
  Usuario.find()
    .then((usuarios) => {
      console.log(usuarios);
      res.render("listarUsuarios", { usuarios }); // Enviamos el array 'usuarios' a la plantilla
    })
    .catch((err) => res.status(500).send("Error al obtener los usuarios"));
};

// Controlador para actualizar un usuario
const actualizarUsuario = (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, mail, rol, contraseña } = req.body;

  Usuario.findById(id)
      .then(usuario => {
          if (!usuario) {
              return res.status(404).send('Usuario no encontrado.');
          }

          if (nombre) usuario.nombre = nombre;
          if (apellido) usuario.apellido = apellido;
          if (mail) usuario.mail = mail;
          if (rol) usuario.rol = rol;
          if (contraseña) usuario.contraseña = contraseña;

          return usuario.save()
              .then(() => {
                  console.log('Usuario actualizado correctamente.');
                  res.redirect("/api/usuarios/listar")
              })
              .catch(err => {
                  console.error('Error al actualizar el usuario:', err);
                  res.status(500).send('Error al actualizar el usuario: ' + err);
              });
      })
      .catch(err => {
          console.error('Error al buscar el usuario:', err);
          res.status(500).send('Error al buscar el usuario: ' + err);
      });
};


// Renderizar formulario para actualizar usuario
function renderizarActualizarUsuario(req, res) {
  const { id } = req.params; // Obtener ID del usuario de los parámetros

  Usuario.findById(id) // Buscar usuario por ID
    .then((usuario) => {
      if (!usuario) {
        return res.status(404).send("Usuario no encontrado."); // Manejo de error si el usuario no existe
      }

      res.render("actualizarUsuario", { usuario }); // Renderizar vista con datos del usuario
    })
    .catch((err) => {
      res.status(500).send("Error al buscar usuario: " + err); // Manejo de error
    });
}

// Función para eliminar un usuario por ID
const eliminarUsuario = (req, res) => {
  const { id } = req.params;
  console.log("Método:", req.method); // Imprime el método HTTP (debería ser DELETE)
  console.log("ID del usuario:", req.params.id); // Imprime el ID del usuario que estás tratando de eliminar

  Usuario.findByIdAndDelete(id)
    .then((usuarioEliminado) => {
      if (!usuarioEliminado) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
      res.status(200).json({
        mensaje: "Usuario eliminado correctamente",
        usuario: usuarioEliminado,
      });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ mensaje: "Error al eliminar el usuario", error: err })
    );
};

// Función para alternar el estado de un usuario (habilitar/deshabilitar)
const alternarEstadoUsuario = (req, res) => {
  const { id } = req.params; // Obtener el ID del usuario de los parámetros

  // Buscar el usuario por ID
  Usuario.findById(id)
    .then((usuario) => {
      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" }); // Manejo de error si el usuario no existe
      }

      // Alternar el estado del usuario
      usuario.activo = !usuario.activo; // Cambiar el estado a su opuesto

      // Guardar el usuario actualizado
      return usuario.save();
    })
    .then(() => {
      res.redirect("/api/usuarios/listar");
    })
    .catch((err) => {
      res.status(500).json({
        mensaje: "Error al alternar el estado del usuario",
        error: err,
      }); // Manejo de error
    });
};

// Exportar las funciones utilizando module.exports
module.exports = {
  crearUsuario,
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  alternarEstadoUsuario,
  renderizarActualizarUsuario,
};
