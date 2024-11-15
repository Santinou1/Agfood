const mongoose = require('mongoose');
const axios = require('axios');
const Archivo = require('../models/Archivo');
const { sendMail } = require('../utils/mailService');
const renderMessageAdmin = require('../utils/renderMessageAdmin');

const enviarCorreoConExcel = (req, res) => {
    const fecha = req.query.fecha || new Date().toISOString().split('T')[0];

    if (!fecha) {
        return res.status(400).send("Fecha no proporcionada en la solicitud.");
    }

    Archivo.findOne({ nombre: `pedidos_${fecha}.xlsx` })
        .then(archivo => {
            if (!archivo) {
                return axios.get(`http://agfood.vercel.app/api/pedidos/guardarExcel?fecha=${fecha}`)
                    .then(() => Archivo.findOne({ nombre: `pedidos_${fecha}.xlsx` }))
                    .then(newArchivo => {
                        if (!newArchivo) {
                            throw new Error("Error al crear el archivo en MongoDB.");
                        }
                        return newArchivo;
                    });
            }
            return archivo;
        })
        .then(archivo => {
            const contenidoBuffer = Buffer.isBuffer(archivo.contenido) 
                ? archivo.contenido 
                : Buffer.from(archivo.contenido);

            return sendMail({
                to: process.env.EMAIL_SEND,
                subject: `Pedidos del ${fecha}`,
                text: `Adjunto encontrarás el Excel con los pedidos del ${fecha}.`,
                attachments: [{
                    filename: archivo.nombre,
                    content: contenidoBuffer,
                    contentType: archivo.tipo
                }]
            });
        })
        .then(() => {
            renderMessageAdmin(
                res,
                "Felicidades",
                "Se envio correctamente el Mail.",
                "/admin"
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