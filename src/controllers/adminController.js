const xlsx = require("xlsx");
const fs = require("fs");
const Menu = require("../models/Menu")
const path = require("path");
const renderMessageAdmin = require("../utils/renderMessageAdmin");


const processExcelUpload = (req, res) => {
  // Obtener el buffer del archivo subido (usando multer en memoria)
  const excelBuffer = req.file.buffer;

  return new Promise((resolve, reject) => {
    try {
      // Leer el archivo Excel desde el buffer
      const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0]; // Tomar la primera hoja del Excel
      const worksheet = workbook.Sheets[sheetName];

      // Convertir los datos de la hoja a un array de arrays
      const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

      // Estructurar los datos en formato JSON
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

      // Procesar las filas del Excel, ignorando la primera (que es el encabezado)
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
      // Buscar si ya existe un documento de menú y actualizarlo
      return Menu.findOneAndUpdate(
        {}, // Esto busca cualquier documento de menú (porque solo debe haber uno)
        { $set: formattedData }, // Se reemplazan los campos con los nuevos datos
        { upsert: true, new: true, setDefaultsOnInsert: true } // upsert: true inserta si no existe
      );
    })
    .then((menu) => {
      if (!menu) {
        return new Menu(formattedData).save();
      }
      return menu;
    })
    .then(() => {
      // Enviar una respuesta al cliente
      renderMessageAdmin(
        res,
        "Felicidades",
        "La subida de archivos fue exitosa y el menú ha sido actualizado en la base de datos.",
        "/admin" // Redirigir a la página principal o donde desees
      );
    })
    .catch((error) => {
      console.error('Error al subir y procesar el archivo Excel:', error);
      res.status(500).send('Error al procesar el archivo Excel.');
    });
};

// Función para mostrar la vista del panel de administración
const adminPanel = (req, res) => {
  res.render("adminPanel"); // Renderiza la vista del panel de admin
};

// Exportar las funciones utilizando module.exports
module.exports = {
  adminPanel,
  processExcelUpload,
};
