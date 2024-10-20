const express = require('express');
const session = require('express-session'); // Importar express-session
const path = require('path');
const connectDB = require('./src/db');
const menuRoutes = require('./src/routes/menuRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const adminRoutes = require('./src/routes/adminRoutes'); // Importar las rutas de admin
const usuarioRoutes = require('./src/routes/usuarioRoutes'); // Importar las rutas de usuario
const authMiddleware = require('./src/middleware/authMiddleware'); // Importar el middleware de autenticación


const app = express();

// Conectar a MongoDB
connectDB();

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware para servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para procesar body como JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
    secret: 'tu-secreto', // Cambia esto a una cadena aleatoria en producción
    resave: false,
    saveUninitialized: true,
}));

// Configuración de las rutas
app.use('/api/menu', menuRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/admin', adminRoutes); // Usar las rutas de admin
app.use('/api/usuarios', usuarioRoutes); // Agregar las rutas de usuario


app.get('/pedido', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'formularioDePedido.html'));
});



/* app.get('/admin/usuarios', (req, res) => {
    res.redirect('/admin/usuarios/listar'); // Redirigir a la ruta de listar usuarios
}); */




// Configuración del puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});
