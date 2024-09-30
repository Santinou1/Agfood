document.addEventListener("DOMContentLoaded", function () {
    let originalState = {}; // Almacenar el estado original de los selectores

    // Función para bloquear o habilitar empanadas en base a la selección de otra comida
    function bloquearEmpanadasSiOtraComidaSeleccionada() {
        const categoriasComida = ["menuDelDia", "tartas", "pastasCocidas", "ravioles"];
        let algunaComidaSeleccionada = false;

        categoriasComida.forEach((categoria) => {
            const elemento = document.getElementById(categoria);
            if (elemento && elemento.value !== "") {
                algunaComidaSeleccionada = true;
            }
        });

        const empanadasSelect = document.getElementById("empanadasSelect");
        const empanadasContainer = document.getElementById("empanadas");

        // Si alguna otra comida fue seleccionada, bloquear empanadas
        if (algunaComidaSeleccionada) {
            empanadasSelect.disabled = true;
            empanadasContainer.style.display = 'none'; // Ocultar menú de empanadas
        } else {
            empanadasSelect.disabled = false; 
            // Mostrar el menú de empanadas solo si se selecciona "SI" en el select de empanadas
            if (empanadasSelect.value === "SI") {
                empanadasContainer.style.display = 'block'; // Desplegar empanadas
            } else {
                empanadasContainer.style.display = 'none'; // Ocultar si es "NO"
            }
        }
    }

    // Llamar a la función al cargar la página por si ya hay opciones seleccionadas
    bloquearEmpanadasSiOtraComidaSeleccionada();

    // Evento para controlar la selección del dropdown de empanadas
    document.getElementById("empanadasSelect").addEventListener("change", function () {
        bloquearEmpanadasSiOtraComidaSeleccionada();
    });

    // Evento para bloquear empanadas si otra comida es seleccionada
    const categoriasComida = ["menuDelDia", "tartas", "pastasCocidas", "ravioles"];
    categoriasComida.forEach((categoria) => {
        document.getElementById(categoria).addEventListener("change", function () {
            bloquearEmpanadasSiOtraComidaSeleccionada();
        });
    });

    // Cargar opciones del menú desde la API de Express
    fetch("/api/menu")
        .then((response) => response.json())
        .then((menu) => {
            const categorias = [
                "menuDelDia",
                "empanadas",
                "tartas",
                "pastasCocidas",
                "ravioles",
                "salsas",
            ];

            categorias.forEach((categoria) => {
                const element = document.getElementById(categoria);
                const resetButton = document.getElementById('resetForm');

                if (menu.hasOwnProperty(categoria)) {
                    if (categoria === "empanadas") {
                        // Para empanadas, añadir checkboxes agrupados
                        menu[categoria].forEach((empanada) => {
                            // Crear un div para agrupar los checkboxes de la misma empanada
                            const empanadaDiv = document.createElement("div");
                            empanadaDiv.classList.add("empanada-group");
                            
                            // Etiqueta para el tipo de empanada
                            const empanadaLabel = document.createElement("label");
                            empanadaLabel.textContent = empanada;
                            empanadaLabel.classList.add("empanada-label");
                            empanadaDiv.appendChild(empanadaLabel);

                            // Añadir hasta 4 checkboxes para cada empanada
                            for (let i = 1; i <= 4; i++) {
                                const checkbox = document.createElement("input");
                                checkbox.type = "checkbox";
                                checkbox.id = `${empanada}_${i}`;
                                checkbox.name = `empanadas_${empanada}`;
                                checkbox.classList.add("empanada-checkbox");

                                const label = document.createElement("label");
                                label.htmlFor = checkbox.id;
                                label.classList.add("empanada-checkbox-label");

                                empanadaDiv.appendChild(checkbox);
                                empanadaDiv.appendChild(label);
                            }
                            element.appendChild(empanadaDiv);
                        });

                        // Añadir evento para limitar el número de selecciones a 4 y deshabilitar el resto
                        element.addEventListener('change', function () {
                            const selectedCheckboxes = document.querySelectorAll('input[name^="empanadas_"]:checked');
                            if (selectedCheckboxes.length > 4) {
                                alert('No puedes seleccionar más de 4 empanadas.');
                                selectedCheckboxes[selectedCheckboxes.length - 1].checked = false;
                            }

                            if (selectedCheckboxes.length == 4) {
                                // Deshabilitar el resto de los checkboxes
                                document.querySelectorAll('input[name^="empanadas_"]:not(:checked)').forEach((checkbox) => {
                                    checkbox.disabled = true;
                                    checkbox.classList.add('disabled');
                                });
                            } else {
                                // Rehabilitar todos los checkboxes si son menos de 4
                                document.querySelectorAll('input[name^="empanadas_"]').forEach((checkbox) => {
                                    checkbox.disabled = false;
                                    checkbox.classList.remove('disabled');
                                });
                            }
                        });
                    } else {
                        // Para otras categorías, usar select
                        menu[categoria].forEach((plato) => {
                            const option = document.createElement("option");
                            option.value = plato;
                            option.textContent = plato;
                            element.appendChild(option);
                        });
                    }
                } else {
                    console.error(`No se encontró la categoría ${categoria} en el menú.`);
                }

                element.addEventListener("change", function () {
                    // Deshabilitar otros selectores al elegir uno
                    categorias.forEach((c) => {
                        if (c !== categoria) {
                            document.getElementById(c).disabled = true;
                        }
                    });

                    // Habilitar selector de salsas si se elige Ravioles o Pastas Cocidas
                    if (categoria === "ravioles" || categoria === "pastasCocidas") {
                        document.getElementById("salsas").disabled = false;
                    } else {
                        document.getElementById("salsas").disabled = true;
                    }
                    resetButton.style.display = 'block';
                });

                // Guardar estado original de los selectores
                originalState[categoria] = element.innerHTML;
            });
        })
        .catch((error) => console.error("Error al cargar el menú:", error));

    // Manejar envío del formulario de pedido
    document.getElementById("pedidoForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar envío estándar del formulario

        // Obtener valores de los campos del formulario
        const nombre = document.getElementById("nombre").value;
        const menuDelDia = document.getElementById("menuDelDia").value;
        const empanadas = Array.from(document.querySelectorAll("input[name^='empanadas_']:checked")).map(el => el.id.split('_')[0]);
        const tartas = document.getElementById("tartas").value;
        const pastasCocidas = document.getElementById("pastasCocidas").value;
        const ravioles = document.getElementById("ravioles").value;
        const salsas = document.getElementById("salsas").value;

        // Crear objeto con datos del pedido
        const data = {
            nombre: nombre,
            ...(menuDelDia && { menuDelDia: menuDelDia }), // Incluir solo si menuDelDia tiene valor
            ...(empanadas.length && { empanadas: empanadas.join(', ') }),
            ...(tartas && { tartas: "Tarta de " + tartas }),
            ...(pastasCocidas && { pastasCocidas: pastasCocidas }),
            ...(ravioles && { ravioles: "Ravioles " + ravioles }),
            ...(salsas && { salsas: salsas }),
            fecha: new Date().toISOString() // Agregar fecha actual en formato ISO
        };

        // Enviar solicitud POST a la API para guardar el pedido
        fetch("/api/pedidos/guardarPedido", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.text())
            .then((message) => {
                console.log(message); // Mostrar mensaje del servidor en consola
                alert("¡Pedido enviado con éxito!");
            })
            .catch((error) => {
                console.error("Error al enviar pedido:", error);
                alert("Ocurrió un error al enviar el pedido.");
            });

        // Habilitar todos los selectores después de enviar el pedido
        document.querySelectorAll("select").forEach((select) => {
            select.disabled = false;
        });

        // Limpiar formulario después de enviar
        document.getElementById("pedidoForm").reset();
    });

    // Evento para restablecer selecciones de menú
    document.getElementById('resetForm').addEventListener('click', function () {
        const resetButton = document.getElementById('resetForm');
        // Restaurar selectores a su estado original
        Object.keys(originalState).forEach(categoria => {
            document.getElementById(categoria).innerHTML = originalState[categoria];
        });

        // Habilitar todos los selectores
        document.querySelectorAll('select').forEach(select => {
            select.disabled = false;
        });

        // Deshabilitar selector de salsas por defecto
        document.getElementById('salsas').disabled = true;
        resetButton.style.display = 'none';
    });

    // Evento para buscar por fecha y redirigir a la descarga de Excel
    document.getElementById("buscarFechaForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Evitar el envío estándar del formulario

        // Obtener fecha seleccionada por el usuario
        const fechaSeleccionada = document.getElementById("fecha").value;

        // Redirigir a la página de descarga de Excel con la fecha seleccionada
        window.location.href = `/api/pedidos/porFecha/${fechaSeleccionada}`;
    });
});

