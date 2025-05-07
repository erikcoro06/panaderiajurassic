     let totalGlobal = 0;
        let nombreGlobal = "";
        let fechaGlobal = "";
        let complementosDetalleGlobal = [];
        let pizza1Global = {nombre: "", precio: 0};
        let pizza2Global = {nombre: "", precio: 0};
        let pizza3Global = {nombre: "", precio: 0};
        let tipoServicioGlobal = "";
        let metodoPagoGlobal = "";
        let direccionGlobal = "";
        let telefonoGlobal = "";

        // Comenzar pedido
      document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("comenzar").addEventListener("click", function() {
        document.getElementById("bienvenida").classList.remove("activa");
        document.getElementById("formulario-seccion").classList.add("activa");
    });
});
        // Calcular pedido
        document.getElementById("calcular").addEventListener("click", function() {
            const nombre = document.getElementById("nombre").value;
            const fecha = document.getElementById("Fecha").value;

            if (!nombre || !fecha) {
                alert("Por favor complete todos los campos obligatorios");
                return;
            }

            const pizza1Select = document.getElementById("Pizza1");
            pizza1Global = {
                nombre: pizza1Select.options[pizza1Select.selectedIndex].text.split(" ")[0],
                precio: parseFloat(pizza1Select.value) || 0
            };

            const pizza2Select = document.getElementById("Pizza2");
            pizza2Global = {
                nombre: pizza2Select.options[pizza2Select.selectedIndex].text.split(" ")[0],
                precio: parseFloat(pizza2Select.value) || 0
            };

            const pizza3Select = document.getElementById("Pizza3");
            pizza3Global = {
                nombre: pizza3Select.options[pizza3Select.selectedIndex].text.split(" ")[0],
                precio: parseFloat(pizza3Select.value) || 0
            };

            // Validar que al menos una pizza fue seleccionada
            if (pizza1Global.precio === 0 && pizza2Global.precio === 0 && pizza3Global.precio === 0) {
                alert("Por favor seleccione al menos una pizza");
                return;
            }

            const complementos = document.querySelectorAll('.checkbox-container input[type="checkbox"]:checked');
            let complementosTotal = 0;
            let complementosDetalle = [];

            complementos.forEach((complemento) => {
                complementosTotal += parseFloat(complemento.value);
                complementosDetalle.push(complemento.nextElementSibling.textContent);
            });

            const total = pizza1Global.precio + pizza2Global.precio + pizza3Global.precio + complementosTotal;

            totalGlobal = total;
            nombreGlobal = nombre;
            fechaGlobal = fecha;
            complementosDetalleGlobal = complementosDetalle;

            document.getElementById("detalle-seccion").classList.add("activa");
            document.getElementById("formulario-seccion").classList.remove("activa");

            let detalleHTML = `
                <strong>Nombre:</strong> ${nombre}<br>
                <strong>Fecha:</strong> ${fecha}<br>
                <strong>Productos:</strong> 
                <ul>
            `;

            if (pizza1Global.precio > 0) {
                detalleHTML += `<li>Pizza ${pizza1Global.nombre} ($${pizza1Global.precio.toFixed(2)})</li>`;
            }
            if (pizza2Global.precio > 0) {
                detalleHTML += `<li>Pizza ${pizza2Global.nombre} ($${pizza2Global.precio.toFixed(2)})</li>`;
            }
            if (pizza3Global.precio > 0) {
                detalleHTML += `<li>Pizza ${pizza3Global.nombre} ($${pizza3Global.precio.toFixed(2)})</li>`;
            }

            detalleHTML += `
                </ul>
                <strong>Complementos:</strong> ${complementosDetalle.join(", ") || 'Ninguno'}<br>
                <strong>Total:</strong> $${total.toFixed(2)}
            `;

            document.getElementById("detallePedido").innerHTML = detalleHTML;
        });

        // Continuar selección de servicio
        document.getElementById("continuarServicio").addEventListener("click", function() {
            const servicioSeleccionado = document.querySelector('input[name="tipoServicio"]:checked');

            if (!servicioSeleccionado) {
                alert("Por favor seleccione un tipo de servicio");
                return;
            }

            tipoServicioGlobal = servicioSeleccionado.value;

            document.getElementById("detalle-seccion").classList.remove("activa");

            if (tipoServicioGlobal === "Entrega a domicilio") {
                document.getElementById("domicilio-seccion").classList.add("activa");
            } else {
                document.getElementById("pago-seccion").classList.add("activa");
                document.getElementById("totalPagar").textContent = totalGlobal.toFixed(2);
            }
        });

        // Continuar domicilio
        document.getElementById("continuarDomicilio").addEventListener("click", function() {
            const direccion = document.getElementById("direccion").value;
            const telefono = document.getElementById("telefono").value;

            if (!direccion || !telefono) {
                alert("Por favor complete todos los datos de envío");
                return;
            }

            direccionGlobal = direccion;
            telefonoGlobal = telefono;

            document.getElementById("domicilio-seccion").classList.remove("activa");
            document.getElementById("pago-seccion").classList.add("activa");
            document.getElementById("totalPagar").textContent = totalGlobal.toFixed(2);
        });

        // Continuar pago
        document.getElementById("continuarPago").addEventListener("click", function() {
            const metodoPago = document.querySelector('input[name="metodoPago"]:checked');

            if (!metodoPago) {
                alert("Por favor seleccione un método de pago");
                return;
            }

            metodoPagoGlobal = metodoPago.value;

            document.getElementById("pago-seccion").classList.remove("activa");

            if (metodoPagoGlobal === "Efectivo") {
                document.getElementById("efectivo-seccion").classList.add("activa");
                document.getElementById("totalEfectivo").textContent = totalGlobal.toFixed(2);
            } else if (metodoPagoGlobal === "Tarjeta") {
                document.getElementById("tarjeta-seccion").classList.add("activa");
            }
        });

       // Finalizar efectivo
document.getElementById("finalizarEfectivo").addEventListener("click", function() {
    const montoPago = parseFloat(document.getElementById("montoPago").value);
    const mensajeCambio = document.getElementById("mensajeCambio");

    if (isNaN(montoPago)) {  // Aquí estaba el error: faltaba cerrar el paréntesis
        mensajeCambio.innerHTML = '<span class="mensaje-error">Por favor ingrese una cantidad válida</span>';
        return;
    }

    if (montoPago < totalGlobal) {
        mensajeCambio.innerHTML = '<span class="mensaje-error">El monto ingresado es insuficiente</span>';
        return;
    }

    const cambio = montoPago - totalGlobal;
    mensajeCambio.innerHTML = `<span class="mensaje-ok">Cambio: $${cambio.toFixed(2)}</span>`;

    document.getElementById("efectivo-seccion").classList.remove("activa");
    document.getElementById("ticket-seccion").classList.add("activa");

    mostrarTicket("Efectivo", montoPago, cambio);
});
        // Finalizar tarjeta
        document.getElementById("finalizarTarjeta").addEventListener("click", function() {
            const numeroTarjeta = document.getElementById("numeroTarjeta").value;
            const fechaExp = document.getElementById("fechaExp").value;
            const cvv = document.getElementById("cvv").value;

            if (!numeroTarjeta || !fechaExp || !cvv) {
                alert("Por favor complete todos los datos de la tarjeta");
                return;
            }

            // Validación básica de tarjeta
            if (!/^\d{16}$/.test(numeroTarjeta)) {
                alert("Número de tarjeta inválido. Debe tener 16 dígitos");
                return;
            }

            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaExp)) {
                alert("Formato de fecha inválido. Use MM/AA");
                return;
            }

            if (!/^\d{3,4}$/.test(cvv)) {
                alert("CVV inválido. Debe tener 3 o 4 dígitos");
                return;
            }

            document.getElementById("tarjeta-seccion").classList.remove("activa");
            document.getElementById("ticket-seccion").classList.add("activa");

            mostrarTicket("Tarjeta", totalGlobal, 0);
        });

        // Mostrar ticket completo
        function mostrarTicket(metodoPago, montoPagado, cambio) {
            let ticketHTML = `
                <h3>Pizzería El Comunismo de Perú</h3>
                <p>Fecha: ${new Date().toLocaleString()}</p>
                <hr>
                <strong>Cliente:</strong> ${nombreGlobal}<br>
                <strong>Fecha del pedido:</strong> ${fechaGlobal}<br>
                <strong>Tipo de servicio:</strong> ${tipoServicioGlobal}<br>
            `;

            if (tipoServicioGlobal === "Entrega a domicilio") {
                ticketHTML += `
                    <strong>Dirección:</strong> ${direccionGlobal}<br>
                    <strong>Teléfono:</strong> ${telefonoGlobal}<br>
                `;
            }

            ticketHTML += `
                <hr>
                <h4>Detalle del Pedido:</h4>
                <ul>
            `;

            if (pizza1Global.precio > 0) {
                ticketHTML += `<li>Pizza ${pizza1Global.nombre} - $${pizza1Global.precio.toFixed(2)}</li>`;
            }
            if (pizza2Global.precio > 0) {
                ticketHTML += `<li>Pizza ${pizza2Global.nombre} - $${pizza2Global.precio.toFixed(2)}</li>`;
            }
            if (pizza3Global.precio > 0) {
                ticketHTML += `<li>Pizza ${pizza3Global.nombre} - $${pizza3Global.precio.toFixed(2)}</li>`;
            }

            if (complementosDetalleGlobal.length > 0) {
                ticketHTML += `<li>Complementos: ${complementosDetalleGlobal.join(", ")}</li>`;
            }

            ticketHTML += `
                </ul>
                <hr>
                <strong>Subtotal:</strong> $${(pizza1Global.precio + pizza2Global.precio + pizza3Global.precio).toFixed(2)}<br>
                <strong>Complementos:</strong> $${(totalGlobal - (pizza1Global.precio + pizza2Global.precio + pizza3Global.precio)).toFixed(2)}<br>
                <strong>Total:</strong> $${totalGlobal.toFixed(2)}<br>
                <strong>Método de Pago:</strong> ${metodoPago}<br>
            `;

            if (metodoPago === "Efectivo") {
                ticketHTML += `
                    <strong>Monto recibido:</strong> $${montoPagado.toFixed(2)}<br>
                    <strong>Cambio:</strong> $${cambio.toFixed(2)}<br>
                `;
            }

            ticketHTML += `
                <hr>
                <p>¡Gracias por su compra!</p>
            `;

            document.getElementById("ticketResumen").innerHTML = ticketHTML;
        }

        // Funcionalidad para volver al inicio
        document.getElementById("volver-inicio").addEventListener("click", function() {
            location.reload();
        });

        // Funcionalidad para imprimir ticket
        document.getElementById("imprimir-ticket").addEventListener("click", function() {
            const contenido = document.getElementById("ticketResumen").innerHTML;
            const ventana = window.open('', '', 'width=600,height=600');
            ventana.document.write('<html><head><title>Ticket de Compra</title></head><body>');
            ventana.document.write(contenido);
            ventana.document.write('</body></html>');
            ventana.document.close();
            ventana.print();
        });

      
        (function() {
            emailjs.init('I7oEhEpXP4jX3imk-'); 
        })();
        
        
        document.getElementById("btnQuejas").addEventListener("click", function() {
            document.getElementById("modalQuejas").style.display = "flex";
        });

        document.getElementById("cerrarModal").addEventListener("click", function() {
            document.getElementById("modalQuejas").style.display = "none";
            document.getElementById("formQuejas").reset();
        });

        document.getElementById("formQuejas").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById("nombreQueja").value;
    const email = document.getElementById("emailQueja").value;
    const comentario = document.getElementById("comentarioQueja").value;
    
    // Formatear fecha
    const ahora = new Date();
    const fechaFormateada = ahora.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    emailjs.send('service_38oqoc8', 'template_si5y8mg', {
        from_name: nombre,
        from_email: email,
        message: comentario,
        date: fechaFormateada
    })
    .then(function(response) {
        alert("Gracias por tus comentarios. Haremos lo posible por mejorar.");
        document.getElementById("modalQuejas").style.display = "none";
        document.getElementById("formQuejas").reset();
    }, function(error) {
        console.error('Error al enviar:', error);
        alert("Ocurrió un error al enviar tu mensaje. Por favor intenta nuevamente.");
    });
});
