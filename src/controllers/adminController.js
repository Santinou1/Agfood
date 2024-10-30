const xlsx = require("xlsx");
const Menu = require("../models/Menu");
const Usuario = require("../models/Usuario");
const nodemailer = require("nodemailer");
const renderMessageAdmin = require("../utils/renderMessageAdmin");

// Función para enviar correos masivos a todos los usuarios
const sendBulkMail = () => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return Usuario.find({}, 'mail')  // Obtener todos los correos electrónicos de los usuarios
    .then((usuarios) => {
      const emailList = usuarios.map((user) => user.mail);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailList,
        subject: '¡Actualización del Menú! ¡Ya puedes hacer tu pedido!',
        text: 'El menú ha sido actualizado exitosamente. Por favor, revisa los nuevos cambios.',
        html: `
            <div style="font-family: Arial, sans-serif; margin: 20px; padding: 20px; background-color: rgba(255, 255, 255, 0.9); border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <h2 style="color: rgba(241, 102, 37, 1);">¡El Menú ha sido Actualizado!</h2>
                <p style="color: rgba(76, 76, 78, 1);">Nos complace informarte que el menú ha sido actualizado exitosamente. Ya puedes hacer tu pedido.</p>
                <p style="color: rgba(76, 76, 78, 1);">Por favor, revisa los nuevos cambios y selecciona tus opciones favoritas.</p>
                <a href="https://agfood.vercel.app/" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: rgba(241, 102, 37, 1); color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Hacer Pedido</a>
            </div>
        `,
    };

      return transporter.sendMail(mailOptions);
    })
    .then(() => {
      console.log("Correo masivo enviado exitosamente");
    })
    .catch((error) => {
      console.error('Error al enviar el correo masivo:', error);
      throw error;
    });
};

// Función para procesar la subida del archivo Excel
const processExcelUpload = (req, res) => {
  const excelBuffer = req.file.buffer;

  new Promise((resolve, reject) => {
    try {
      const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

      let formattedData = {
        menuDelDia: [],
        empanadas: [],
        tartas: [],
        pastasCocidas: [],
        ravioles: [],
        salsas: [],
        ensaladas: [],
        ingredientesEnsalada: []
      };

      data.slice(1).forEach((row) => {
        if (row[0]) formattedData.menuDelDia.push(row[0]);
        if (row[1]) formattedData.empanadas.push(row[1]);
        if (row[2]) formattedData.tartas.push(row[2]);
        if (row[3]) formattedData.pastasCocidas.push(row[3]);
        if (row[4]) formattedData.ravioles.push(row[4]);
        if (row[5]) formattedData.salsas.push(row[5]);
        if (row[6]) formattedData.ensaladas.push(row[6]);
        if (row[7]) formattedData.ingredientesEnsalada.push(row[7]);
      });

      resolve(formattedData);
    } catch (error) {
      reject(error);
    }
  })
    .then((formattedData) => {
      // Actualizar el documento de menú en la base de datos
      return Menu.findOneAndUpdate(
        {},
        { $set: formattedData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    })
    .then((menu) => {
      if (!menu) {
        return new Menu(formattedData).save();
      }
      return menu;
    })
    .then(() => {
      // Renderizar mensaje de éxito
      renderMessageAdmin(
        res,
        "Felicidades",
        "La subida de archivos fue exitosa, se les envio un correo a todos los empleados y el menú ha sido actualizado en la base de datos.",
        "/admin"
      );
      
      // Enviar correos electrónicos masivos
      return sendBulkMail();
    })
    .catch((error) => {
      console.error('Error al subir y procesar el archivo Excel o enviar el correo:', error);
      res.status(500).send('Error al procesar el archivo Excel o enviar el correo masivo.');
    });
};

// Función para mostrar la vista del panel de administración
const adminPanel = (req, res) => {
  res.render("adminPanel");
};

module.exports = {
  adminPanel,
  processExcelUpload,
};
