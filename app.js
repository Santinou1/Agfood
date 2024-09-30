const express = require('express');
const path = require('path');
const connectDB = require('./src/db'); // Importa la función de conexión a MongoDB
const menuRoutes = require('./src/routes/menuRoutes'); // Importa las rutas del menú
const pedidoRoutes = require('./src/routes/pedidoRoutes'); // Importa las rutas de pedidos

const app = express(); // Crea una instancia de la aplicación Express

// Conectar a MongoDB usando la función importada de db.js
connectDB();

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware para servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para procesar body como JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de las rutas para el API de menú y pedidos
app.use('/api/menu', menuRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Ruta para la página principal que sirve un archivo estático HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configuración del puerto de escucha, utilizando el puerto especificado en la variable de entorno PORT o el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});
