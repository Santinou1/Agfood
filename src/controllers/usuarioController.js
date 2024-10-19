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
        .then(() => res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: nuevoUsuario }))
        .catch((err) =>
          res.status(500).send("Error al crear el usuario: " + err)
        );
    })
    .catch((err) => res.status(500).send("Error al buscar usuario: " + err));
}

// Listar todos los usuarios
function listarUsuarios(req, res) {
  Usuario.find()
    .then((usuarios) => res.json(usuarios))
    .catch((err) => res.status(500).send("Error al listar usuarios: " + err));
}

// Deshabilitar un usuario (cambiar su rol o estado)
function deshabilitarUsuario(req, res) {
  const { id } = req.params;

  Usuario.findByIdAndUpdate(id, { rol: "deshabilitado" }, { new: true })
    .then((usuarioActualizado) => {
      if (!usuarioActualizado) {
        return res.status(404).send("Usuario no encontrado.");
      }
      res.send("Usuario deshabilitado exitosamente.");
    })
    .catch((err) =>
      res.status(500).send("Error al deshabilitar usuario: " + err)
    );
}

// Actualizar email y/o contraseña
function actualizarUsuario(req, res) {
  const { id } = req.params;
  const { mail, contraseña } = req.body;

  Usuario.findById(id)
    .then((usuario) => {
      if (!usuario) {
        return res.status(404).send("Usuario no encontrado.");
      }

      // Actualizar correo electrónico si se proporciona
      if (mail) {
        usuario.mail = mail;
      }

      // Actualizar contraseña si se proporciona
      if (contraseña) {
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(contraseña, salt))
          .then((hash) => {
            usuario.contraseña = hash;
            return usuario.save();
          })
          .then(() => res.send("Usuario actualizado exitosamente."))
          .catch((err) =>
            res.status(500).send("Error al actualizar contraseña: " + err)
          );
      } else {
        // Si no se actualiza la contraseña, solo se guarda el usuario
        usuario
          .save()
          .then(() => res.send("Usuario actualizado exitosamente."))
          .catch((err) =>
            res.status(500).send("Error al actualizar usuario: " + err)
          );
      }
    })
    .catch((err) => res.status(500).send("Error al buscar usuario: " + err));
}

// Función para eliminar un usuario por ID
const eliminarUsuario = (req, res) => {
    const { id } = req.params;
    Usuario.findByIdAndDelete(id)
        .then(usuarioEliminado => {
            if (!usuarioEliminado) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            res.status(200).json({ mensaje: 'Usuario eliminado correctamente', usuario: usuarioEliminado });
        })
        .catch(err => res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: err }));
};

// Función para rehabilitar un usuario (cambiar su rol a 'usuario')
const rehabilitarUsuario = (req, res) => {
  const { id } = req.params; // Obtener el ID del usuario de los parámetros

  // Actualizar el rol del usuario a 'usuario'
  return Usuario.findByIdAndUpdate(id, { rol: 'usuario' }, { new: true })
      .then(usuario => {
          if (!usuario) {
              return res.status(404).json({ mensaje: 'Usuario no encontrado' }); // Manejo de error si el usuario no existe
          }
          res.json({ mensaje: 'Usuario rehabilitado', usuario }); // Responder con el usuario actualizado
      })
      .catch(err => {
          res.status(500).json({ mensaje: 'Error al rehabilitar el usuario', error: err }); // Manejo de error
      });
};

// Exportar las funciones utilizando module.exports
module.exports = {
  crearUsuario,
  listarUsuarios,
  deshabilitarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  rehabilitarUsuario,
};
