totalGlobal = 0;
let nombreGlobal = "";
let fechaGlobal = "";
let complementosDetalleGlobal = [];
let pizza1Global = {nombre: "Mexicana", precio: 0};
let pizza2Global = {nombre: "Pepperoni", precio: 0};
let pizza3Global = {nombre: "Hawaiana", precio: 0};
let tipoServicioGlobal = "";

document.getElementById("comenzar").addEventListener("click", function () {
    document.getElementById("bienvenida").classList.remove("activa");
    document.getElementById("formulario-seccion").classList.add("activa");
});

// Calcular pedido
document.getElementById("calcular").addEventListener("click", function () {
    const nombre = document.getElementById("nombre").value;
    const Fecha = document.getElementById("Fecha").value;
    
    // Obtener pizzas seleccionadas
    const pizza1Select = document.getElementById("Pizza1");
    pizza1Global = {
        nombre: pizza1Select.options[pizza1Select.selectedIndex].text.split(" ")[0],
        precio: parseFloat(pizza1Select.value)
    };
    
    const pizza2Select = document.getElementById("Pizza2");
    pizza2Global = {
        nombre: pizza2Select.options[pizza2Select.selectedIndex].text.split(" ")[0],
        precio: parseFloat(pizza2Select.value)
    };
    
    const pizza3Select = document.getElementById("Pizza3");
    pizza3Global = {
        nombre: pizza3Select.options[pizza3Select.selectedIndex].text.split(" ")[0],
        precio: parseFloat(pizza3Select.value)
    };

    const complementos = document.querySelectorAll('.checkbox-container input[type="checkbox"]:checked');
    let complementosTotal = 0;
    let complementosDetalle = [];

    complementos.forEach((complemento) => {
        complementosTotal += parseFloat(complemento.value);
        complementosDetalle.push(complemento.nextElementSibling.textContent);
    });

    const total = pizza1Global.precio + pizza2Global.precio + pizza3Global.precio + complementosTotal;

    // Guardamos globalmente
    totalGlobal = total;
    nombreGlobal = nombre;
    fechaGlobal = Fecha;
    complementosDetalleGlobal = complementosDetalle;

    document.getElementById("detalle-seccion").classList.add("activa");
    document.getElementById("formulario-seccion").classList.remove("activa");

    document.getElementById("detallePedido").innerHTML = `
        <strong>Nombre:</strong> ${nombre}<br>
        <strong>Fecha:</strong> ${Fecha}<br>
        <strong>Productos:</strong> 
        <ul>
            <li>Pizza ${pizza1Global.nombre} ($${pizza1Global.precio.toFixed(2)})</li>
            <li>Pizza ${pizza2Global.nombre} ($${pizza2Global.precio.toFixed(2)})</li>
            <li>Pizza ${pizza3Global.nombre} ($${pizza3Global.precio.toFixed(2)})</li>
        </ul>
        <strong>Complementos:</strong> ${complementosDetalle.join(", ")}<br>
        <strong>Total:</strong> $${total.toFixed(2)}
    `;
});

// Continuar selección de servicio
document.getElementById("continuarServicio").addEventListener("click", function () {
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
document.getElementById("continuarDomicilio").addEventListener("click", function(){
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    
    if (!direccion || !telefono) {
        alert("Por favor complete todos los datos de envío");
        return;
    }
    
    document.getElementById("domicilio-seccion").classList.remove("activa");
    document.getElementById("pago-seccion").classList.add("activa");
    document.getElementById("totalPagar").textContent = totalGlobal.toFixed(2);
});

// Continuar pago
document.getElementById("continuarPago").addEventListener("click", function () {
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked');
    
    if (!metodoPago) {
        alert("Por favor seleccione un método de pago");
        return;
    }
    
    document.getElementById("pago-seccion").classList.remove("activa");
    
    if (metodoPago.value === "Efectivo") {
        document.getElementById("efectivo-seccion").classList.add("activa");
        document.getElementById("totalEfectivo").textContent = totalGlobal.toFixed(2);
        
        // Configurar evento para mostrar cambio en tiempo real
        document.getElementById("montoPago").addEventListener("input", function() {
            const montoPago = parseFloat(this.value);
            const mensajeCambio = document.getElementById("mensajeCambio");
            
            if (isNaN(montoPago) || montoPago <= 0) {
                mensajeCambio.innerHTML = '<span class="mensaje-error">Por favor ingrese una cantidad válida</span>';
                return;
            }
            
            if (montoPago < totalGlobal) {
                mensajeCambio.innerHTML = '<span class="mensaje-error">El monto ingresado es insuficiente</span>';
                return;
            }
            
            const cambio = montoPago - totalGlobal;
            mensajeCambio.innerHTML = `<span class="mensaje-ok">Cambio: $${cambio.toFixed(2)}</span>`;
        });
    } else if (metodoPago.value === "Tarjeta") {
        document.getElementById("tarjeta-seccion").classList.add("activa");
    }
});

// Finalizar efectivo
document.getElementById("finalizarEfectivo").addEventListener("click", function () {
    const montoPago = parseFloat(document.getElementById("montoPago").value);
    const mensajeCambio = document.getElementById("mensajeCambio");
    
    if (isNaN(montoPago) || montoPago <= 0) {
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
document.getElementById("finalizarTarjeta").addEventListener("click", function () {
    const numeroTarjeta = document.getElementById("numeroTarjeta").value;
    const fechaExp = document.getElementById("fechaExp").value;
    const cvv = document.getElementById("cvv").value;
    
    if (!numeroTarjeta || !fechaExp || !cvv) {
        alert("Por favor complete todos los datos de la tarjeta");
        return;
    }
    
    document.getElementById("tarjeta-seccion").classList.remove("activa");
    document.getElementById("ticket-seccion").classList.add("activa");

    mostrarTicket("Tarjeta", totalGlobal, 0);
});

// Función para mostrar ticket
function mostrarTicket(metodoPago, montoPagado, cambio) {
    let ticketHTML = `
        <strong>Nombre:</strong> ${nombreGlobal}<br>
        <strong>Fecha:</strong> ${fechaGlobal}<br>
        <strong>Tipo de servicio:</strong> ${tipoServicioGlobal}<br>
        <strong>Productos:</strong>
        <ul>
            <li>Pizza ${pizza1Global.nombre} ($${pizza1Global.precio.toFixed(2)})</li>
            <li>Pizza ${pizza2Global.nombre} ($${pizza2Global.precio.toFixed(2)})</li>
            <li>Pizza ${pizza3Global.nombre} ($${pizza3Global.precio.toFixed(2)})</li>
        </ul>
        <strong>Complementos:</strong> ${complementosDetalleGlobal.join(", ")}<br>
        <strong>Total:</strong> $${totalGlobal.toFixed(2)}<br>
        <strong>Método de Pago:</strong> ${metodoPago}<br>
    `;
    
    if (metodoPago === "Efectivo") {
        ticketHTML += `
            <strong>Monto recibido:</strong> $${montoPagado.toFixed(2)}<br>
            <strong>Cambio:</strong> $${cambio.toFixed(2)}<br>
        `;
    }
    
    if (tipoServicioGlobal === "Entrega a domicilio") {
        ticketHTML += `<strong>Dirección de entrega:</strong> ${document.getElementById("direccion").value}<br>`;
        ticketHTML += `<strong>Teléfono:</strong> ${document.getElementById("telefono").value}<br>`;
    }
    
    document.getElementById("ticketResumen").innerHTML = ticketHTML;
}

// Botón para volver al inicio
document.getElementById("volver-inicio").addEventListener("click", function () {
    location.reload();
}); 
