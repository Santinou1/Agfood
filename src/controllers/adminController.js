const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const dataFilePath = path.join(__dirname, "../../data/menu.json");

// Función para procesar el archivo Excel y actualizar el JSON
const procesarExcelYActualizarJSON = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No se ha subido ningún archivo.");
  }

  const filePath = req.file.path; // Ruta del archivo cargado

  try {
    // Leer el archivo Excel
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Leer la primera hoja
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convertir a JSON

    // Escribir el JSON en el archivo data.json
    fs.writeFileSync(dataFilePath, JSON.stringify(sheetData, null, 2));

    // Eliminar el archivo subido (opcional)
    fs.unlinkSync(filePath);

    res.send("Archivo Excel procesado y datos actualizados correctamente.");
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).send("Error al procesar el archivo.");
  }
};

const processExcelUpload = (req, res) => {
  // Ruta del archivo Excel subido
  const excelPath = req.file.path;

  // Leer el archivo Excel
  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0]; // Tomar la primera hoja del Excel
  const worksheet = workbook.Sheets[sheetName];

  // Convertir los datos de la hoja a un array de arrays
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  // Estructurar los datos en formato JSON deseado
  let formattedData = {
    menuDelDia: [],
    empanadas: [],
    tartas: [],
    pastasCocidas: [],
    ravioles: [],
    salsas: [],
    ensaladas: [],
    ingredientesEnsalada: [],
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

  // Guardar los datos en el archivo menu.json
  const jsonPath = path.join(__dirname, "../../data/menu.json");
  fs.writeFileSync(jsonPath, JSON.stringify(formattedData, null, 2), "utf-8");

  // Enviar una respuesta al cliente
  res.send(`
        <h2>Felicidades </h2>
        <p>La subida de archivos fue exitosa</p>
        <button onclick="window.location.href='/'">Volver al Panel de Administración</button>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                margin-top: 50px;}

            button {           
                /* Estilos opcionales para el botón */
                text-decoration: none; /* Quitar el subrayado del enlace */
                background-color: #007bff; /* Color de fondo */
                color: white; /* Color del texto */
                border: none; /* Sin borde */
                padding: 10px 20px; /* Espaciado */
                cursor: pointer; /* Cursor tipo mano */
                border-radius: 5px; /* Bordes redondeados */
                font-size: 16px; /* Tamaño de fuente */
            }

            button:hover {
                background-color: #0056b3; /* Color de fondo al pasar el mouse */
            }
        </style>
    `);
};

// Función para mostrar la vista del panel de administración
const adminPanel = (req, res) => {
  res.render("adminPanel"); // Renderiza la vista del panel de admin
};

// Exportar las funciones utilizando module.exports
module.exports = {
  adminPanel,
  procesarExcelYActualizarJSON,
  processExcelUpload,
};
