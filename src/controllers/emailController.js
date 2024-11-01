const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const axios = require('axios'); // Importar axios para hacer solicitudes HTTP
const Archivo = require('../models/Archivo');
const renderMessageAdmin = require('../utils/renderMessageAdmin');

// Configurar el transportador de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto según tu proveedor de correo
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Controlador para enviar el correo con el Excel adjunto
const enviarCorreoConExcel = (req, res) => {
    const fecha = req.query.fecha || new Date().toISOString().split('T')[0]; // Usar la fecha proporcionada o la fecha actual

    // Verificar si la fecha fue proporcionada
    if (!fecha) {
        return res.status(400).send("Fecha no proporcionada en la solicitud.");
    }

    // Buscar el archivo en MongoDB
    Archivo.findOne({ nombre: `pedidos_${fecha}.xlsx` })
        .then(archivo => {
            // Si el archivo no existe, lo creamos haciendo la llamada a la ruta correspondiente
            if (!archivo) {
                return axios.get(`http://agfood.vercel.app/api/pedidos/guardarExcel?fecha=${fecha}`)
                    .then(response => {
                        console.log('Archivo creado:', response.data);
                        
                        // Después de crear el archivo, volvemos a buscarlo en la base de datos
                        return Archivo.findOne({ nombre: `pedidos_${fecha}.xlsx` });
                    })
                    .then(newArchivo => {
                        if (!newArchivo) {
                            return res.status(404).send("Error al crear el archivo en MongoDB.");
                        }
                        return newArchivo;
                    });
            }
            return archivo; // Retornar el archivo existente
        })
        .then(archivo => {
            // Asegúrate de que 'contenido' es un Buffer
            let contenidoBuffer = Buffer.isBuffer(archivo.contenido) ? archivo.contenido : Buffer.from(archivo.contenido);

            // Enviar el correo
            const mailOptions = {
                from: process.env.EMAIL_USER, // Remitente
                to: process.env.EMAIL_SEND, // Cambia por el email del destinatario
                subject: `Pedidos del ${fecha}`,
                text: `Adjunto encontrarás el Excel con los pedidos del ${fecha}.`,
                attachments: [{
                    filename: archivo.nombre,
                    content: contenidoBuffer, // Aquí está el contenido del archivo como Buffer
                    contentType: archivo.tipo // Asegúrate de que esto sea un tipo MIME válido
                }]
            };

            return transporter.sendMail(mailOptions);
        })
        .then(() => {
            // Enviar una respuesta al cliente
            renderMessageAdmin(
              res,
              "Felicidades",
              "Se envio correctamente el Mail.",
              "/admin" // Redirigir a la página principal o donde desees
            );
          })
        .catch(error => {
            console.error("Error al enviar el correo:", error);
            res.status(500).send("Error al enviar el correo: " + error);
        });
};

module.exports = {
    enviarCorreoConExcel
};
