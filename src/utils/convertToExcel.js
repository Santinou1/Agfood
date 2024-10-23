const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Ruta al archivo Excel cargado
const excelPath = path.join(__dirname, '../../uploads', 'uploaded-file.xlsx');

// Leer el archivo Excel
const workbook = xlsx.readFile(excelPath);

// Seleccionar la primera hoja
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convertir el contenido de la hoja a JSON
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // `header: 1` devuelve el contenido como array de arrays

// Inicializar el objeto que contendrá el JSON final
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

// Llenar el objeto JSON con los datos del Excel
data.slice(1).forEach(row => {
    if (row[0]) formattedData.menuDelDia.push(row[0]);
    if (row[1]) formattedData.empanadas.push(row[1]);
    if (row[2]) formattedData.tartas.push(row[2]);
    if (row[3]) formattedData.pastasCocidas.push(row[3]);
    if (row[4]) formattedData.ravioles.push(row[4]);
    if (row[5]) formattedData.salsas.push(row[5]);
    if (row[6]) formattedData.ensaladas.push(row[6]);
    if (row[7]) formattedData.ingredientesEnsalada.push(row[7]);
});

// Guardar los datos en el archivo data.json
fs.writeFileSync(path.join(__dirname, '../../public/menu.json'), JSON.stringify(formattedData, null, 2), 'utf-8');

console.log('Archivo JSON actualizado con éxito');
    