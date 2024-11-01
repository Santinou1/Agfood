const nodemailer = require('nodemailer'); // Importar nodemailer
const Archivo = require("../models/Archivo"); // Importar el modelo Archivo
const ExcelJS = require('exceljs'); // Importar ExcelJS para la generación de archivos Excel
const Pedido = require("../models/Pedido"); // Importar el modelo Pedido
const moment = require("moment"); // Importar moment.js para el manejo de fechas
const { sendMail } = require('../utils/mailService'); // Importar el servicio de correo


// Función para guardar un nuevo pedido
const guardarPedido = (req, res) => {
    const pedidoData = req.body; // Obtener los datos del cuerpo de la solicitud

    // Obtener la fecha actual
    const now = moment();

    // Formatear la fecha en formato YYYY/MM/DD
    const fechaFormateada1 = now.format("YYYY/MM/DD");

    // Agregar el campo de fecha formateada al pedido
    pedidoData.fechaFormateada1 = fechaFormateada1;

    // Crear una nueva instancia del modelo Pedido con los datos recibidos
    const nuevoPedido = new Pedido(pedidoData);

    // Guardar el nuevo pedido en la base de datos
    nuevoPedido
        .save()
        .then((pedidoGuardado) => {
            console.log("Pedido guardado:", pedidoGuardado);
            res.status(201).send("Pedido guardado con éxito"); // Enviar respuesta de éxito
        })
        .catch((error) => {
            console.error("Error al guardar el pedido:", error);
            res.status(500).send("Error al guardar el pedido"); // Enviar respuesta de error
        });
};

// Función para obtener pedidos por una fecha específica y renderizarlos
const obtenerPedidosPorFecha = (req, res) => {
    const fecha = req.query.fecha; // Obtener la fecha de los parámetros de la solicitud (ahora desde query)

    // Validar la fecha
    if (!fecha || isNaN(new Date(fecha).getTime())) {
        return res.status(400).send('Fecha inválida'); // Manejo de errores si la fecha es inválida
    }

    Pedido.find({
        fecha: {
            $gte: new Date(fecha), // Fecha mayor o igual
            $lt: new Date(new Date(fecha).setDate(new Date(fecha).getDate() + 1)) // Fecha menor a mañana
        }
    })
    .then(pedidos => res.render('pedidosPorFecha', { pedidos, fecha })) // Renderizar la vista con los pedidos
    .catch(err => res.status(500).send('Error al obtener los pedidos: ' + err)); // Manejar errores
};

// Función para exportar pedidos a Excel para una fecha específica
const exportarPedidosExcel = (req, res) => {
    const fecha = req.query.fecha;

    // Buscar pedidos por fecha
    const fechaInicio = moment(fecha, "YYYY-MM-DD").startOf("day").toDate();
    const fechaFin = moment(fecha, "YYYY-MM-DD").endOf("day").toDate();

    Pedido.find({
        fecha: {
            $gte: fechaInicio,
            $lte: fechaFin,
        },
    })
    .then(pedidos => {
        // Generar archivo Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Pedidos');

        // Definir columnas del archivo Excel
        worksheet.columns = [
            { header: 'Nombre', key: 'nombre', width: 20 },
            { header: 'Comida', key: 'comida', width: 40 }
        ];

        // Agregar filas al archivo Excel
        pedidos.forEach((pedido) => {
            worksheet.addRow({
                nombre: pedido.nombre,
                comida: [
                    pedido.menuDelDia,
                    pedido.empanadas,
                    pedido.tartas,
                    pedido.pastasCocidas,
                    pedido.ravioles,
                    pedido.salsas,
                    pedido.ensalada
                ].filter((comida) => comida).join(', '), // Convertir array a cadena separada por comas
            });
        });

        // Crear un buffer del archivo Excel
        return workbook.xlsx.writeBuffer()
            .then(buffer => {
                // Guardar el archivo en la colección de archivos
                const nuevoArchivo = new Archivo({
                    nombre: `pedidos_${fecha}.xlsx`,
                    contenido: buffer,
                    tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                return nuevoArchivo.save().then(() => buffer);
            });
    })
    .then(buffer => {
        // Configurar los datos del correo
        const mailOptions = {
            from: process.env.EMAIL_USER, // Remitente
            to: process.env.EMAIL_SEND, // Cambia por el email del destinatario
            subject: `Pedidos del ${fecha}`,
            text: `Adjunto encontrarás el Excel con los pedidos del ${fecha}.`,
            attachments: [{
                filename: `pedidos_${fecha}.xlsx`, // Asegúrate de que el nombre sea correcto
                content: contenidoBuffer, // Aquí el contenido del archivo como Buffer
                contentType: archivo.tipo // Verifica que esto sea un tipo MIME válido
            }]
        };

        // Enviar el correo usando el servicio
        return sendMail(mailOptions.to, mailOptions.subject, mailOptions.text, buffer, mailOptions.attachments[0].filename);
    })
    .then(() => res.status(200).send('Archivo guardado en MongoDB y correo enviado con éxito'))
    .catch(error => {
        console.error("Error al enviar el correo:", error);
        res.status(500).send('Error al guardar el archivo y enviar el correo');
    });
};

// Función para guardar el archivo Excel en MongoDB
const guardarExcelEnMongo = (req, res) => {
    const fecha = req.query.fecha;

    // Buscar pedidos por fecha
    const fechaInicio = moment(fecha, "YYYY-MM-DD").startOf("day").toDate();
    const fechaFin = moment(fecha, "YYYY-MM-DD").endOf("day").toDate();

    Pedido.find({
        fecha: {
            $gte: fechaInicio,
            $lte: fechaFin,
        },
    })
    .then(pedidos => {
        // Generar archivo Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Pedidos');

        // Definir columnas del archivo Excel
        worksheet.columns = [
            { header: 'Nombre', key: 'nombre', width: 20 },
            { header: 'Comida', key: 'comida', width: 40 }
        ];

        // Agregar filas al archivo Excel
        pedidos.forEach((pedido) => {
            worksheet.addRow({
                nombre: pedido.nombre,
                comida: [
                    pedido.menuDelDia,
                    pedido.empanadas,
                    pedido.tartas,
                    pedido.pastasCocidas,
                    pedido.ravioles,
                    pedido.salsas,
                    pedido.ensalada
                ].filter((comida) => comida).join(', '), // Convertir array a cadena separada por comas
            });
        });

        // Crear un buffer del archivo Excel
        return workbook.xlsx.writeBuffer()
            .then(buffer => {
                // Guardar el archivo en la colección de archivos
                const nuevoArchivo = new Archivo({
                    nombre: `pedidos_${fecha}.xlsx`,
                    contenido: buffer,
                    tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                return nuevoArchivo.save();
            });
    })
    .then(() => res.status(200).send('Archivo Excel guardado en MongoDB con éxito'))
    .catch(error => {
        console.error("Error al guardar el archivo en MongoDB:", error);
        res.status(500).send('Error al guardar el archivo en MongoDB');
    });
};

// Función para obtener el archivo Excel
const obtenerArchivoExcel = (req, res) => {
    const nombreArchivo = req.params.nombre;

    Archivo.findOne({ nombre: nombreArchivo })
        .then(archivo => {
            if (!archivo) {
                return res.status(404).send('Archivo no encontrado');
            }

            res.setHeader('Content-Type', archivo.tipo);
            res.setHeader('Content-Disposition', `attachment; filename=${archivo.nombre}`);
            res.send(archivo.contenido);
        })
        .catch(error => {
            console.error("Error al obtener el archivo:", error);
            res.status(500).send('Error al obtener el archivo');
        });
};

// Exportar las funciones del controlador para ser utilizadas en otras partes de la aplicación
module.exports = { guardarPedido, obtenerPedidosPorFecha, exportarPedidosExcel, guardarExcelEnMongo, obtenerArchivoExcel };
