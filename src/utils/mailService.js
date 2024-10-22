const nodemailer = require('nodemailer');
require('dotenv').config(); // Asegúrate de tener dotenv instalado y configurado

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    
    service: 'gmail', // Cambia el servicio según tu proveedor
    auth: {
        user: process.env.EMAIL_USER, // Usuario desde el archivo .env
        pass: process.env.EMAIL_PASS // Contraseña desde el archivo .env
    }
    
});
console.log(transporter.auth)
/**
 * Envía un correo electrónico con un archivo adjunto.
 * @param {string} to - El destinatario del correo.
 * @param {string} subject - El asunto del correo.
 * @param {string} text - El cuerpo del correo.
 * @param {string} attachmentPath - La ruta del archivo adjunto.
 * @param {string} attachmentName - El nombre del archivo adjunto.
 * @returns {Promise} - Promesa que se resuelve si el correo se envió correctamente, o se rechaza si ocurre un error.
 */
const sendMail = (to, subject, text, attachmentPath, attachmentName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Cambia por tu email
        to: to, // El destinatario
        subject: subject,
        text: text,
        attachments: [
            {
                filename: attachmentName,
                path: attachmentPath // Ruta del archivo Excel
            }
        ]
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendMail,
};
