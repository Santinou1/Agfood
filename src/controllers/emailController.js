const mailService = require("../utils/mailService");
const fs = require("fs");
const path = require("path");

/**
 * Controlador para enviar el correo con el Excel adjunto.
 * @param {Object} req - La solicitud de Express.
 * @param {Object} res - La respuesta de Express.
 */
exports.enviarCorreoConExcel = (req, res) => {
  // Obtener la fecha de los parámetros de la consulta
  const fecha = req.query.fecha; // Cambiado para obtener la fecha de los parámetros de la consulta

  console.log("Fecha recibida:", fecha); // Para depurar y ver qué fecha se recibe

  // Verificar si la fecha fue proporcionada
  if (!fecha) {
    return res.status(400).send("Fecha no proporcionada en la solicitud.");
  }

  // Construir la ruta del archivo Excel
  const excelFilePath = path.join("../../Desktop/AG/informes", `pedidos_${fecha}.xlsx`);
  const attachmentName = `pedidos_${fecha}.xlsx`;

  // Verificar si el archivo existe antes de enviarlo
  fs.access(excelFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Error al acceder al archivo:", err); // Imprimir el error en la consola para depuración
      return res
        .status(404)
        .send(`
          <h2>Ocurrio un Error</h2>
          <p>Corrobore que tiene descargado el archivo Excel</p>
          <a href="/api/pedidos/buscar" class="admin-button">Ir a descargar el excel</a>

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

    mailService
      .sendMail(
        "santinolursino@gmail.com", // Cambia por el email del destinatario
        `Pedidos del ${fecha}`,
        `Adjunto encontrarás el Excel con los pedidos del ${fecha}.`,
        excelFilePath,
        attachmentName
      )
      .then(() => res.send(`
  <h2>Congratulations</h2>
  <p>Se envio el mail correctamente!</p>
  <a href="/admin" class="admin-button">Ir al panel admin</a>

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
`))
      .catch((error) => {
        console.error("Error al enviar el correo:", error); // Imprimir el error en la consola para depuración
        res.status(500).send("Error al enviar el correo: " + error);
      });
  });
};

