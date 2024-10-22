const xlsx = require('xlsx');
const fs = require('fs');

// Lee el JSON desde un archivo o puede ser directamente un objeto
const data = JSON.parse(fs.readFileSync("../../data/menu.json", 'utf-8')); // Asume que el JSON está en un archivo

// Crear un nuevo libro de trabajo (workbook)
const workbook = xlsx.utils.book_new();

// Recorrer cada categoría y convertirla en una hoja separada
Object.keys(data).forEach(category => {
    const sheetData = data[category].map(item => [item]); // Convierte los datos a formato de array de arrays
    const worksheet = xlsx.utils.aoa_to_sheet(sheetData); // Convierte los datos a una hoja de Excel
    xlsx.utils.book_append_sheet(workbook, worksheet, category); // Añadir la hoja al libro
});

// Escribir el archivo Excel
xlsx.writeFile(workbook, '../../data/menu.xlsx'); // Nombre del archivo Excel de salida
