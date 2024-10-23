const mongoose = require('mongoose');
const xlsx = require('xlsx'); // Asegúrate de que sea el correcto

const menuSchema = new mongoose.Schema({
    menuDelDia: [String],
    empanadas: [String],
    tartas: [String],
    pastasCocidas: [String],
    ravioles: [String],
    salsas: [String],
    ensaladas: [String],
    ingredientesEnsalada: [String]
  });
  
module.exports = mongoose.model('Menu', menuSchema);
