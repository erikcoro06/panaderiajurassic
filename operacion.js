totalGlobal = 0;
let nombreGlobal = "";
let fechaGlobal = "";
let complementosDetalleGlobal = [];
let pizza1Global = { nombre: "No seleccionada", precio: 0 };
let pizza2Global = { nombre: "No seleccionada", precio: 0 };
let pizza3Global = { nombre: "No seleccionada", precio: 0 };
let tipoServicioGlobal = "";

document.getElementById("comenzar").addEventListener("click", function () {
    document.getElementById("bienvenida").classList.remove("activa");
    document.getElementById("formulario-seccion").classList.add("activa");
});

// Calcular pedido
document.getElementById("calcular").addEventListener("click", function () {
    const nombre = document.getElementById("nombre").value;
    const fecha = document.getElementById("Fecha").value;

    // Obtener pizzas seleccionadas
    const obtenerPizza = (id) => {
        const pizzaSelect = document.getElementById(id);
        if (pizzaSelect.value === "") {
            return { nombre: "No seleccionada", precio: 0 };
        }
        return {
            nombre: pizzaSelect.options[pizzaSelect.selectedIndex].text.split(" ")[0],
            precio: parseFloat(pizzaSelect.value),
        };
    };

    pizza1Global = obtenerPizza("Pizza1");
    pizza2Global = obtenerPizza("Pizza2");
    pizza3Global = obtenerPizza("Pizza3");

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
    fechaGlobal = fecha;
    complementosDetalleGlobal = complementosDetalle;

    document.getElementById("detalle-seccion").classList.add("activa");
    document.getElementById("formulario-seccion").classList.remove("activa");

    document.getElementById("detallePedido").innerHTML = `
        <strong>Nombre:</strong> ${nombre}<br>
        <strong>Fecha:</strong> ${fecha}<br>
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
document.getElementById("continuarDomicilio").addEventListener("click", function () {
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
        document.getElementById("montoPago").addEventListener("input", function () {
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

// Botón "Quejas, Denuncias y Comentarios"
document.getElementById("btnQuejas").addEventListener("click", function () {
    document.getElementById("modalQuejas").style.display = "block";
});

// Cerrar modal de comentarios
document.getElementById("cerrarModal").addEventListener("click", function () {
    document.getElementById("modalQuejas").style.display = "none";
});

// Enviar formulario de comentarios
document.getElementById("formQuejas").addEventListener("submit", function (event) {
    event.preventDefault();

    const nombreQueja = document.getElementById("nombreQueja").value;
    const comentarioQueja = document.getElementById("comentarioQueja").value;

    const destinatario = "coronelefa113@gmail.com";
    const asunto = "Queja, Denuncia o Comentario";
    const cuerpo = `Nombre: ${nombreQueja}\nComentario: ${comentarioQueja}`;

    window.location.href = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    document.getElementById("modalQuejas").style.display = "none";
});
 doc.save("ticket.pdf");
});
