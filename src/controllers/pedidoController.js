const Pedido = require("../models/Pedido"); // Importar el modelo Pedido
const moment = require("moment"); // Importar moment.js para el manejo de fechas
const ExcelJS = require('exceljs'); // Importar ExcelJS para la generación de archivos Excel

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
    const fecha = req.params.fecha;
    const fechaInicio = moment(fecha, "YYYY-MM-DD").startOf("day").toDate(); // Obtener fecha de inicio del día
    const fechaFin = moment(fecha, "YYYY-MM-DD").endOf("day").toDate(); // Obtener fecha de fin del día

    // Buscar pedidos en el rango de fechas especificado
    Pedido.find({
        fecha: {
            $gte: fechaInicio, // Mayor o igual que fechaInicio
            $lte: fechaFin, // Menor o igual que fechaFin
        },
    })
    .then((pedidos) => {
        // Filtrar y formatear los pedidos para exportar a Excel
        const pedidosFiltrados = pedidos.map((pedido) => ({
            nombre: pedido.nombre,
            comida: [
                pedido.menuDelDia,
                pedido.empanadas,
                pedido.tartas,
                pedido.pastasCocidas,
                pedido.ravioles,
                pedido.salsas,
                pedido.ensalada
            ].filter((comida) => comida), // Filtrar comidas vacías
        }));

        // Generar archivo Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Pedidos');

        // Definir columnas del archivo Excel
        worksheet.columns = [
            { header: 'Nombre', key: 'nombre', width: 20 },
            { header: 'Comida', key: 'comida', width: 40 }
        ];

        // Agregar filas al archivo Excel
        pedidosFiltrados.forEach((pedido) => {
            worksheet.addRow({
                nombre: pedido.nombre,
                comida: pedido.comida.join(', '), // Convertir array a cadena separada por comas
            });
        });

        // Establecer cabeceras de respuesta para la descarga de Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=pedidos_${fecha}.xlsx`);

        // Escribir el archivo Excel en la respuesta HTTP
        workbook.xlsx.write(res)
            .then(() => {
                res.end();
            })
            .catch((error) => {
                console.error('Error al escribir Excel:', error);
                res.status(500).send('Error al exportar a Excel'); // Enviar respuesta de error
            });
    })
    .catch((error) => {
        console.error("Error al obtener los pedidos:", error);
        res.status(500).send("Error al obtener los pedidos"); // Enviar respuesta de error
    });
};

// Exportar las funciones del controlador para ser utilizadas en otras partes de la aplicación
module.exports = { guardarPedido, obtenerPedidosPorFecha, exportarPedidosExcel };
