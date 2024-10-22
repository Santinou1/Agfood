const mongoose = require('mongoose');
require('dotenv').config()

// Función para conectar a la base de datos MongoDB
const connectDB = () => {
    return mongoose.connect(process.env.URL_MONGO)
        .then(() => {
            console.log('MongoDB connected'); // Mensaje de éxito al conectar
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error); // Mensaje de error si la conexión falla
            process.exit(1); // Salir del proceso con código de error
        });
};

module.exports = connectDB; // Exportar la función de conexión
