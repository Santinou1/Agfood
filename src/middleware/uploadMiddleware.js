const multer = require('multer');
const path = require('path');

// Configuración de multer para almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Carpeta donde se guardará el archivo temporalmente
    },
    filename: (req, file, cb) => {
        cb(null, `uploaded-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

module.exports = upload;
