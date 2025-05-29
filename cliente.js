document.addEventListener('DOMContentLoaded', function () {
    // === Variables y elementos ===
    const tablaProductos = document.getElementById('tabla-productos');
    const totalPedidoElement = document.getElementById('total-pedido');
    let pedido = obtenerPedidoGuardado();
    let totalPedido = 0;
    let datosPago = {};
    let datosEnvio = {};
    let datosCliente = {};

    // Mostrar productos
    if (!pedido || !Array.isArray(pedido.items) || pedido.items.length === 0) {
        alert('No hay productos en tu pedido. Serás redirigido al catálogo.');
        window.location.href = 'catalogo.html';
        return;
    }
    tablaProductos.innerHTML = "";
    pedido.items.forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.nombre || "-"}</td>
            <td>${item.cantidad || 0}</td>
            <td>$${(item.precio || 0).toFixed(2)}</td>
            <td>$${(item.subtotal || 0).toFixed(2)}</td>
        `;
        tablaProductos.appendChild(fila);
        totalPedido += item.subtotal || 0;
    });
    totalPedidoElement.textContent = `$${totalPedido.toFixed(2)}`;

    // === Formulario 1: Método de pago ===
    const formMetodoPago = document.getElementById('form-metodo-pago');
    const efectivoSection = document.getElementById('efectivo-section');
    const tarjetaSection = document.getElementById('tarjeta-section');
    const transferenciaSection = document.getElementById('transferencia-section');
    const mensajeCambio = document.getElementById('mensaje-cambio');
    formMetodoPago.addEventListener('change', function (e) {
        const metodo = formMetodoPago.querySelector('input[name="metodo-pago"]:checked');
        mostrarSeccionPago(metodo ? metodo.value : null);
    });
    // Denominaciones rápido
    document.querySelectorAll('.btn-denominacion').forEach(btn => {
        btn.onclick = () => {
            document.getElementById('monto-efectivo').value = btn.dataset.monto;
            calcularCambio();
        };
    });
    document.getElementById('monto-efectivo').addEventListener('input', calcularCambio);

    function mostrarSeccionPago(metodo) {
        efectivoSection.classList.add('hidden');
        tarjetaSection.classList.add('hidden');
        transferenciaSection.classList.add('hidden');
        if (metodo === 'efectivo') {
            efectivoSection.classList.remove('hidden');
            calcularCambio();
        } else if (metodo === 'tarjeta') {
            tarjetaSection.classList.remove('hidden');
        } else if (metodo === 'transferencia') {
            transferenciaSection.classList.remove('hidden');
            document.getElementById('monto-transferencia').value = totalPedido.toFixed(2);
            document.getElementById('referencia-id').textContent = generarReferencia();
        }
    }

    function calcularCambio() {
        const monto = parseFloat(document.getElementById('monto-efectivo').value) || 0;
        if (monto >= totalPedido) {
            const cambio = monto - totalPedido;
            mensajeCambio.innerHTML = `<span class="cambio-positivo">Cambio: $${cambio.toFixed(2)}</span>`;
            mensajeCambio.style.backgroundColor = 'rgba(90, 143, 90, 0.1)';
        } else {
            const faltante = totalPedido - monto;
            mensajeCambio.innerHTML = `<span class="cambio-negativo">Faltan: $${faltante.toFixed(2)}</span>`;
            mensajeCambio.style.backgroundColor = 'rgba(196, 86, 86, 0.1)';
        }
    }

    formMetodoPago.addEventListener('submit', function (e) {
        e.preventDefault();
        const metodo = formMetodoPago.querySelector('input[name="metodo-pago"]:checked');
        if (!metodo) {
            alert('Selecciona un método de pago');
            return;
        }
        if (!validarMetodoPago(metodo.value)) return;
        datosPago = recolectarDatosPago(metodo.value);
        // Siguiente formulario
        document.getElementById('form-metodo-pago').classList.add('hidden');
        document.getElementById('form-tipo-envio').classList.remove('hidden');
    });

    function validarMetodoPago(metodo) {
        if (metodo === 'efectivo') {
            const monto = parseFloat(document.getElementById('monto-efectivo').value) || 0;
            if (monto < totalPedido) {
                alert('El monto en efectivo debe ser mayor o igual al total del pedido.');
                return false;
            }
        } else if (metodo === 'tarjeta') {
            const numero = document.getElementById('numero-tarjeta').value.trim();
            const venc = document.getElementById('vencimiento').value.trim();
            const cvv = document.getElementById('cvv').value.trim();
            const tipo = document.querySelector('input[name="tipo-tarjeta"]:checked');
            if (!numero || !/^\d{16}$/.test(numero)) {
                alert('Ingresa un número de tarjeta válido (16 dígitos).');
                return false;
            }
            if (!venc) {
                alert('Selecciona la fecha de vencimiento.');
                return false;
            }
            if (!cvv || !/^\d{3,4}$/.test(cvv)) {
                alert('Ingresa un CVV válido (3 o 4 dígitos).');
                return false;
            }
            if (!tipo) {
                alert('Selecciona el tipo de tarjeta.');
                return false;
            }
        } else if (metodo === 'transferencia') {
            const banco = document.getElementById('banco').value;
            const cuenta = document.getElementById('numero-cuenta').value.trim();
            const nombre = document.getElementById('nombre-destinatario').value.trim();
            if (!banco) {
                alert('Selecciona el banco.');
                return false;
            }
            if (!cuenta || !/^\d{10,20}$/.test(cuenta)) {
                alert('Ingresa un número de cuenta válido (10-20 dígitos).');
                return false;
            }
            if (!nombre) {
                alert('Ingresa el nombre del destinatario.');
                return false;
            }
        }
        return true;
    }

    function recolectarDatosPago(metodo) {
        if (metodo === 'efectivo') {
            const monto = parseFloat(document.getElementById('monto-efectivo').value) || 0;
            return { metodo: 'efectivo', montoRecibido: monto, cambio: monto - totalPedido };
        } else if (metodo === 'tarjeta') {
            const numero = document.getElementById('numero-tarjeta').value.trim();
            const tipo = document.querySelector('input[name="tipo-tarjeta"]:checked').value;
            return { metodo: 'tarjeta', tipo, ultimosDigitos: numero.slice(-4) };
        } else if (metodo === 'transferencia') {
            const banco = document.getElementById('banco').value;
            const cuenta = document.getElementById('numero-cuenta').value.trim();
            const nombre = document.getElementById('nombre-destinatario').value.trim();
            const referencia = document.getElementById('referencia-id').textContent;
            return { metodo: 'transferencia', banco, numeroCuenta: cuenta.slice(-4), nombreDestinatario: nombre, referencia };
        }
        return {};
    }

    // === Formulario 2: Tipo de envío ===
    const formTipoEnvio = document.getElementById('form-tipo-envio');
    const direccionSection = document.getElementById('direccion-section');
    formTipoEnvio.addEventListener('change', function () {
        const tipo = formTipoEnvio.querySelector('input[name="tipo-envio"]:checked');
        if (tipo && tipo.value === 'entrega') {
            direccionSection.classList.remove('hidden');
            document.getElementById('direccion-entrega').required = true;
        } else {
            direccionSection.classList.add('hidden');
            document.getElementById('direccion-entrega').required = false;
        }
    });

    formTipoEnvio.addEventListener('submit', function (e) {
        e.preventDefault();
        const tipo = formTipoEnvio.querySelector('input[name="tipo-envio"]:checked');
        if (!tipo) {
            alert('Selecciona el tipo de envío.');
            return;
        }
        if (tipo.value === 'entrega' && !document.getElementById('direccion-entrega').value.trim()) {
            alert('Ingresa la dirección de entrega.');
            return;
        }
        datosEnvio = {
            tipo: tipo.value,
            direccion: tipo.value === 'entrega' ? document.getElementById('direccion-entrega').value.trim() : 'Recoger en tienda'
        };
        // Siguiente formulario
        document.getElementById('form-tipo-envio').classList.add('hidden');
        document.getElementById('form-datos-cliente').classList.remove('hidden');
    });

    // === Formulario 3: Datos del cliente ===
    const formDatosCliente = document.getElementById('form-datos-cliente');
    formDatosCliente.addEventListener('submit', function (e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const correo = document.getElementById('correo').value.trim();
        if (!nombre || !telefono) {
            alert('Completa los campos obligatorios.');
            return;
        }
        datosCliente = { nombre, telefono, correo };
        // Siguiente formulario: resumen final
        document.getElementById('form-datos-cliente').classList.add('hidden');
        mostrarResumenFinal();
        document.getElementById('form-resumen-final').classList.remove('hidden');
    });

    // === Formulario 4: Resumen final ===
    const formResumenFinal = document.getElementById('form-resumen-final');
    const infoResumen = document.getElementById('info-resumen');
    const btnEditar = document.getElementById('btn-editar');
    formResumenFinal.addEventListener('submit', function(e) {
        e.preventDefault();
        guardarPedidoCompleto();
    });
    btnEditar.addEventListener('click', function() {
        // Permite volver a editar, vuelve al paso 1
        document.getElementById('form-resumen-final').classList.add('hidden');
        document.getElementById('form-metodo-pago').classList.remove('hidden');
    });

    function mostrarResumenFinal() {
        // Productos
        let productosHTML = '<strong>Productos:</strong><ul>';
        pedido.items.forEach(item => {
            productosHTML += `<li>${item.nombre} x${item.cantidad} - $${item.subtotal.toFixed(2)}</li>`;
        });
        productosHTML += `</ul><strong>Total: $${totalPedido.toFixed(2)}</strong><br><br>`;

        // Pago
        let pagoHTML = `<strong>Método de pago:</strong> ${datosPago.metodo}<br>`;
        if (datosPago.metodo === 'efectivo') {
            pagoHTML += `Monto recibido: $${datosPago.montoRecibido.toFixed(2)}<br>Cambio: $${datosPago.cambio.toFixed(2)}<br>`;
        } else if (datosPago.metodo === 'tarjeta') {
            pagoHTML += `Tipo: ${datosPago.tipo}<br>Últimos dígitos: ${datosPago.ultimosDigitos}<br>`;
        } else if (datosPago.metodo === 'transferencia') {
            pagoHTML += `Banco: ${datosPago.banco}<br>Núm. cuenta: ****${datosPago.numeroCuenta}<br>Referencía: ${datosPago.referencia}<br>`;
        }
        pagoHTML += "<br>";

        // Envío
        let envioHTML = `<strong>Tipo de envío:</strong> ${datosEnvio.tipo === "entrega" ? "Entrega a domicilio" : "Recoger en tienda"}<br>`;
        if (datosEnvio.tipo === "entrega") {
            envioHTML += `Dirección: ${datosEnvio.direccion}<br>`;
        }
        envioHTML += "<br>";

        // Cliente
        let clienteHTML = `<strong>Datos del cliente:</strong><br>Nombre: ${datosCliente.nombre}<br>Teléfono: ${datosCliente.telefono}<br>`;
        if (datosCliente.correo) clienteHTML += `Correo: ${datosCliente.correo}<br>`;

        infoResumen.innerHTML = productosHTML + pagoHTML + envioHTML + clienteHTML;
    }

    // === Utilidades ===
    function obtenerPedidoGuardado() {
        try {
            const pedidoGuardado = localStorage.getItem('pedidoJurassicPan');
            if (!pedidoGuardado) return { items: [] };
            const pedido = JSON.parse(pedidoGuardado);
            if (!pedido.items && Array.isArray(pedido)) return { items: pedido };
            return pedido && Array.isArray(pedido.items) ? pedido : { items: [] };
        } catch (e) {
            return { items: [] };
        }
    }

    function guardarPedidoCompleto() {
        const pedidoCompleto = {
            items: pedido.items,
            total: totalPedido,
            pago: datosPago,
            envio: datosEnvio,
            cliente: datosCliente,
            fecha: new Date().toLocaleString(),
            numeroPedido: 'JP-' + Math.floor(Math.random() * 1000000)
        };
        localStorage.setItem('pedidoCompletoJurassicPan', JSON.stringify(pedidoCompleto));
        localStorage.removeItem('pedidoJurassicPan');
        window.location.href = 'ticket.html';
    }

    function generarReferencia() {
        return Math.floor(1000 + Math.random() * 9000);
    }
});
