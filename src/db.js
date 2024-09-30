const mongoose = require('mongoose');

// Función para conectar a la base de datos MongoDB
const connectDB = () => {
    return mongoose.connect('mongodb+srv://santitech:za4YK1cidi7zoZ01@food-test.8ebskof.mongodb.net/?retryWrites=true&w=majority&appName=food-test')
        .then(() => {
            console.log('MongoDB connected'); // Mensaje de éxito al conectar
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error); // Mensaje de error si la conexión falla
            process.exit(1); // Salir del proceso con código de error
        });
};

module.exports = connectDB; // Exportar la función de conexión
