// Variables globales
let totalGlobal = 0;
let nombreGlobal = "";
let telefonoGlobal = "";
let complementosDetalleGlobal = [];
let pizzasGlobal = [];
let tipoServicioGlobal = "";
let direccionGlobal = "";

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Evento para comenzar pedido
    document.getElementById("comenzar").addEventListener("click", function() {
        document.getElementById("bienvenida").classList.remove("activa");
        document.getElementById("formulario-seccion").classList.add("activa");
    });

    // Evento para calcular total
    document.getElementById("calcular").addEventListener("click", calcularTotal);
    
    // Evento para continuar a tipo de servicio
    document.getElementById("continuarServicio").addEventListener("click", continuarServicio);
    
    // Evento para continuar domicilio
    document.getElementById("continuarDomicilio").addEventListener("click", continuarDomicilio);
    
    // Evento para continuar pago
    document.getElementById("continuarPago").addEventListener("click", continuarPago);
    
    // Evento para finalizar con tarjeta
    document.getElementById("finalizarTarjeta").addEventListener("click", finalizarTarjeta);
    
    // Evento para finalizar con efectivo
    document.getElementById("finalizarEfectivo").addEventListener("click", finalizarEfectivo);
    
    // Evento para imprimir ticket
    document.getElementById("imprimir-ticket").addEventListener("click", imprimirTicket);
    
    // Evento para volver al inicio
    document.getElementById("volver-inicio").addEventListener("click", function() {
        location.reload();
    });
    
    // Mostrar cambio en tiempo real
    document.getElementById("montoPago").addEventListener("input", mostrarCambio);
});

// Función para calcular el total
function calcularTotal() {
    // Obtener datos del formulario
    nombreGlobal = document.getElementById("nombre").value;
    telefonoGlobal = document.getElementById("telefono").value;
    
    if (!nombreGlobal || !telefonoGlobal) {
        alert("Por favor complete todos los campos obligatorios");
        return;
    }
    
    // Obtener pizzas seleccionadas
    pizzasGlobal = [];
    const pizza1 = document.getElementById("Pizza1");
    if (parseFloat(pizza1.value) > 0) {
        pizzasGlobal.push({
            nombre: pizza1.options[pizza1.selectedIndex].text.split(" ")[0],
            precio: parseFloat(pizza1.value)
        });
    }
    
    const pizza2 = document.getElementById("Pizza2");
    if (parseFloat(pizza2.value) > 0) {
        pizzasGlobal.push({
            nombre: pizza2.options[pizza2.selectedIndex].text.split(" ")[0],
            precio: parseFloat(pizza2.value)
        });
    }
    
    const pizza3 = document.getElementById("Pizza3");
    if (parseFloat(pizza3.value) > 0) {
        pizzasGlobal.push({
            nombre: pizza3.options[pizza3.selectedIndex].text.split(" ")[0],
            precio: parseFloat(pizza3.value)
        });
    }
    
    if (pizzasGlobal.length === 0) {
        alert("Debe seleccionar al menos una pizza");
        return;
    }

    // Calcular complementos
    const complementos = document.querySelectorAll('.checkbox-container input[type="checkbox"]:checked');
    let complementosTotal = 0;
    complementosDetalleGlobal = [];
    
    complementos.forEach((complemento) => {
        complementosTotal += parseFloat(complemento.value);
        complementosDetalleGlobal.push(complemento.nextElementSibling.textContent);
    });

    // Calcular total
    totalGlobal = pizzasGlobal.reduce((sum, pizza) => sum + pizza.precio, 0) + complementosTotal;
    
    // Mostrar resumen
    mostrarResumenPedido();
    
    // Cambiar a sección de resumen
    document.getElementById("formulario-seccion").classList.remove("activa");
    document.getElementById("detalle-seccion").classList.add("activa");
}

// Función para mostrar resumen del pedido
function mostrarResumenPedido() {
    let html = `
        <p><strong>Nombre:</strong> ${nombreGlobal}</p>
        <p><strong>Teléfono:</strong> ${telefonoGlobal}</p>
        <p><strong>Pizzas:</strong></p>
        <ul>
    `;
    
    pizzasGlobal.forEach(pizza => {
        html += `<li>${pizza.nombre} - $${pizza.precio.toFixed(2)}</li>`;
    });
    
    html += `
        </ul>
        <p><strong>Complementos:</strong> ${complementosDetalleGlobal.join(", ") || 'Ninguno'}</p>
        <p><strong>Total:</strong> $${totalGlobal.toFixed(2)}</p>
    `;
    
    document.getElementById("detallePedido").innerHTML = html;
    document.getElementById("totalPagar").textContent = totalGlobal.toFixed(2);
    document.getElementById("totalEfectivo").textContent = totalGlobal.toFixed(2);
}

// Función para continuar a tipo de servicio
function continuarServicio() {
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
    }
}

// Función para continuar domicilio
function continuarDomicilio() {
    direccionGlobal = document.getElementById("direccion").value;
    const referencias = document.getElementById("referencias").value;
    
    if (!direccionGlobal) {
        alert("Por favor ingrese una dirección de entrega");
        return;
    }
    
    document.getElementById("domicilio-seccion").classList.remove("activa");
    document.getElementById("pago-seccion").classList.add("activa");
}

// Función para continuar pago
function continuarPago() {
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked');
    
    if (!metodoPago) {
        alert("Por favor seleccione un método de pago");
        return;
    }
    
    document.getElementById("pago-seccion").classList.remove("activa");
    
    if (metodoPago.value === "Efectivo") {
        document.getElementById("efectivo-seccion").classList.add("activa");
    } else {
        document.getElementById("tarjeta-seccion").classList.add("activa");
    }
}

// Función para mostrar cambio
function mostrarCambio() {
    const montoPago = parseFloat(document.getElementById("montoPago").value);
    const mensajeCambio = document.getElementById("mensajeCambio");
    
    if (isNaN(montoPago) {
        mensajeCambio.innerHTML = '<span class="mensaje-error">Ingrese una cantidad válida</span>';
        return;
    }
    
    if (montoPago < totalGlobal) {
        mensajeCambio.innerHTML = '<span class="mensaje-error">Monto insuficiente</span>';
        return;
    }
    
    const cambio = montoPago - totalGlobal;
    mensajeCambio.innerHTML = `<span class="mensaje-ok">Cambio: $${cambio.toFixed(2)}</span>`;
}

// Función para finalizar con tarjeta
function finalizarTarjeta() {
    const numeroTarjeta = document.getElementById("numeroTarjeta").value;
    const fechaExp = document.getElementById("fechaExp").value;
    const cvv = document.getElementById("cvv").value;
    
    if (!numeroTarjeta || !fechaExp || !cvv) {
        alert("Por favor complete todos los datos de la tarjeta");
        return;
    }
    
    document.getElementById("tarjeta-seccion").classList.remove("activa");
    mostrarTicketFinal("Tarjeta");
}

// Función para finalizar con efectivo
function finalizarEfectivo() {
    const montoPago = parseFloat(document.getElementById("montoPago").value);
    
    if (isNaN(montoPago) {
        alert("Por favor ingrese un monto válido");
        return;
    }
    
    if (montoPago < totalGlobal) {
        alert("El monto ingresado es insuficiente");
        return;
    }
    
    document.getElementById("efectivo-seccion").classList.remove("activa");
    mostrarTicketFinal("Efectivo", montoPago);
}

// Función para mostrar ticket final
function mostrarTicketFinal(metodoPago, montoPagado = 0) {
    let html = `
        <p><strong>Nombre:</strong> ${nombreGlobal}</p>
        <p><strong>Teléfono:</strong> ${telefonoGlobal}</p>
        <p><strong>Tipo de servicio:</strong> ${tipoServicioGlobal}</p>
    `;
    
    if (tipoServicioGlobal === "Entrega a domicilio") {
        html += `<p><strong>Dirección:</strong> ${direccionGlobal}</p>`;
    }
    
    html += `
        <p><strong>Pizzas:</strong></p>
        <ul>
    `;
    
    pizzasGlobal.forEach(pizza => {
        html += `<li>${pizza.nombre} - $${pizza.precio.toFixed(2)}</li>`;
    });
    
    html += `
        </ul>
        <p><strong>Complementos:</strong> ${complementosDetalleGlobal.join(", ") || 'Ninguno'}</p>
        <p><strong>Total:</strong> $${totalGlobal.toFixed(2)}</p>
        <p><strong>Método de pago:</strong> ${metodoPago}</p>
    `;
    
    if (metodoPago === "Efectivo") {
        const cambio = montoPagado - totalGlobal;
        html += `
            <p><strong>Monto recibido:</strong> $${montoPagado.toFixed(2)}</p>
            <p><strong>Cambio:</strong> $${cambio.toFixed(2)}</p>
        `;
    }
    
    document.getElementById("ticketResumen").innerHTML = html;
    document.getElementById("ticket-seccion").classList.add("activa");
}

// Función para imprimir ticket en PDF
function imprimirTicket() {
    // Verificar si jsPDF está disponible
    if (typeof jsPDF === 'undefined') {
        alert("Error al generar el PDF. Por favor recargue la página.");
        return;
    }

    // Crear nuevo documento PDF
    const doc = new jsPDF();
    
    // Configurar estilos
    doc.setFontSize(18);
    doc.setTextColor(106, 27, 154); // Color morado
    doc.text("Pizzería El Comunismo de Perú", 105, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Negro
    doc.text("Ticket de Compra", 105, 25, { align: 'center' });
    
    // Agregar información del cliente
    doc.setFontSize(12);
    doc.text(`Nombre: ${nombreGlobal}`, 20, 40);
    doc.text(`Teléfono: ${telefonoGlobal}`, 20, 50);
    doc.text(`Tipo de servicio: ${tipoServicioGlobal}`, 20, 60);
    
    if (tipoServicioGlobal === "Entrega a domicilio") {
        doc.text(`Dirección: ${direccionGlobal}`, 20, 70);
    }
    
    // Crear tabla de productos
    const body = [];
    
    // Agregar pizzas
    pizzasGlobal.forEach(pizza => {
        body.push([`Pizza ${pizza.nombre}`, `$${pizza.precio.toFixed(2)}`]);
    });
    
    // Agregar complementos
    if (complementosDetalleGlobal.length > 0) {
        body.push(["Complementos", complementosDetalleGlobal.join(", ")]);
    }
    
    // Agregar total
    body.push(["TOTAL", `$${totalGlobal.toFixed(2)}`]);
    
    // Generar tabla
    doc.autoTable({
        startY: 80,
        head: [['Producto', 'Precio']],
        body: body,
        headStyles: {
            fillColor: [106, 27, 154], // Color morado
            textColor: [255, 255, 255] // Texto blanco
        },
        styles: {
            cellPadding: 5,
            fontSize: 10
        }
    });
    
    // Agregar método de pago
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;
    let finalY = doc.lastAutoTable.finalY + 10;
    
    doc.text(`Método de pago: ${metodoPago}`, 20, finalY);
    
    // Si es pago en efectivo, mostrar cambio
    if (metodoPago === "Efectivo") {
        const montoPago = parseFloat(document.getElementById("montoPago").value);
        const cambio = montoPago - totalGlobal;
        
        doc.text(`Monto recibido: $${montoPago.toFixed(2)}`, 20, finalY + 10);
        doc.text(`Cambio: $${cambio.toFixed(2)}`, 20, finalY + 20);
    }
    
    // Guardar PDF
    doc.save(`Ticket_Pizzeria_${nombreGlobal.replace(/ /g, '_')}.pdf`);
}
