document.addEventListener('DOMContentLoaded', function () {
    // ==== Elementos del DOM ====
    const tablaProductos = document.getElementById('tabla-productos');
    const totalPedidoElement = document.getElementById('total-pedido');
    const efectivoSection = document.getElementById('efectivo-section');
    const tarjetaSection = document.getElementById('tarjeta-section');
    const transferenciaSection = document.getElementById('transferencia-section');
    const mensajeCambio = document.getElementById('mensaje-cambio');
    const formDatosCliente = document.getElementById('datos-cliente');

    // Navegación
    const btnPanes = document.getElementById('btn-panes');
    const btnPasteles = document.getElementById('btn-pasteles');
    const btnComplementos = document.getElementById('btn-complementos');
    const btnVolver = document.getElementById('btn-volver');

    // ==== Recuperar y mostrar datos del cliente ====
    ['nombre', 'telefono', 'correo'].forEach(campo => {
        const valor = localStorage.getItem(`cliente_${campo}`);
        if (valor) document.getElementById(campo).value = valor;
    });

    // ==== Recuperar pedido ====
    let pedido = obtenerPedidoGuardado();

    if (!pedido || !Array.isArray(pedido.items) || pedido.items.length === 0) {
        mostrarAlertaYRedirigir('No hay productos en tu pedido. Serás redirigido al catálogo.', 'pan.html');
        return;
    }

    // ==== Mostrar productos en la tabla ====
    let totalPedido = 0;
    pedido.items.forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td class="cantidad-col">${item.cantidad}</td>
            <td class="precio-col">$${item.precio.toFixed(2)}</td>
            <td class="subtotal-col">$${item.subtotal.toFixed(2)}</td>
        `;
        tablaProductos.appendChild(fila);
        totalPedido += item.subtotal;
    });
    totalPedidoElement.textContent = `$${totalPedido.toFixed(2)}`;

    configurarMetodosPago(totalPedido);
    configurarNavegacion();

    // ==== Manejo del envío del formulario ====
    formDatosCliente.addEventListener('submit', function (e) {
        e.preventDefault();
        guardarDatosCliente();
        procesarPedido(totalPedido);
    });

    // ==== FUNCIONES ====

    function obtenerPedidoGuardado() {
        try {
            const pedidoGuardado = localStorage.getItem('pedidoJurassicPan');
            if (!pedidoGuardado) return { items: [] };
            const pedido = JSON.parse(pedidoGuardado);
            return pedido && Array.isArray(pedido.items) ? pedido : { items: [] };
        } catch (e) {
            return { items: [] };
        }
    }

    function guardarDatosCliente() {
        ['nombre', 'telefono', 'correo'].forEach(campo => {
            const valor = document.getElementById(campo).value.trim();
            localStorage.setItem(`cliente_${campo}`, valor);
        });
    }

    function configurarMetodosPago(total) {
        document.querySelectorAll('input[name="metodo-pago"]').forEach(radio => {
            radio.addEventListener('change', () => mostrarSeccionPago(radio.value, total));
        });
        // Mostrar la sección seleccionada por defecto
        const metodoSeleccionado = document.querySelector('input[name="metodo-pago"]:checked');
        if (metodoSeleccionado) mostrarSeccionPago(metodoSeleccionado.value, total);
    }

    function mostrarSeccionPago(metodo, total) {
        [efectivoSection, tarjetaSection, transferenciaSection].forEach(sec => sec.classList.add('hidden'));
        if (metodo === 'efectivo') {
            efectivoSection.classList.remove('hidden');
            configurarEfectivo(total);
        } else if (metodo === 'tarjeta') {
            tarjetaSection.classList.remove('hidden');
        } else if (metodo === 'transferencia') {
            transferenciaSection.classList.remove('hidden');
            document.getElementById('monto-transferencia').value = total.toFixed(2);
            document.getElementById('referencia-id').textContent = generarReferencia();
        }
    }

    function configurarEfectivo(total) {
        const montoInput = document.getElementById('monto-efectivo');
        const botones = document.querySelectorAll('.btn-denominacion');

        function calcularCambio(montoEfectivo) {
            if (isNaN(montoEfectivo) || montoEfectivo < 0) montoEfectivo = 0;
            if (montoEfectivo >= total) {
                const cambio = montoEfectivo - total;
                mensajeCambio.innerHTML = `<span class="cambio-positivo">Cambio: $${cambio.toFixed(2)}</span>`;
                mensajeCambio.style.backgroundColor = 'rgba(90, 143, 90, 0.1)';
            } else {
                const faltante = total - montoEfectivo;
                mensajeCambio.innerHTML = `<span class="cambio-negativo">Faltan: $${faltante.toFixed(2)}</span>`;
                mensajeCambio.style.backgroundColor = 'rgba(196, 86, 86, 0.1)';
            }
        }

        botones.forEach(btn => {
            btn.onclick = () => {
                const monto = parseFloat(btn.dataset.monto);
                montoInput.value = monto;
                calcularCambio(monto);
            };
        });

        montoInput.oninput = () => {
            calcularCambio(parseFloat(montoInput.value));
        };

        calcularCambio(parseFloat(montoInput.value) || 0);
    }

    function configurarNavegacion() {
        btnPanes.onclick = () => guardarYRedirigir('catalogo.html');
        btnPasteles.onclick = () => guardarYRedirigir('pastel.html');
        btnComplementos.onclick = () => guardarYRedirigir('complementos.html');
        btnVolver.onclick = () => {
            limpiarPedido();
            window.location.href = 'pan.html';
        };
    }

    function procesarPedido(total) {
        const cliente = {
            nombre: document.getElementById('nombre').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            correo: document.getElementById('correo').value.trim() || 'No proporcionado',
            metodoPago: (document.querySelector('input[name="metodo-pago"]:checked') || {}).value
        };

        if (!cliente.nombre || !cliente.telefono) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }

        if (!procesarMetodoPago(cliente.metodoPago, total)) {
            return;
        }

        completarPedido(cliente, total);
    }

    function procesarMetodoPago(metodo, total) {
        try {
            if (metodo === 'efectivo') {
                const montoEfectivo = parseFloat(document.getElementById('monto-efectivo').value) || 0;
                if (montoEfectivo < total) {
                    alert('El monto en efectivo debe ser mayor o igual al total del pedido');
                    return false;
                }
                pedido.pago = {
                    metodo: 'efectivo',
                    montoRecibido: montoEfectivo,
                    cambio: montoEfectivo - total
                };
            } else if (metodo === 'tarjeta') {
                const numeroTarjeta = document.getElementById('numero-tarjeta').value.trim();
                const vencimiento = document.getElementById('vencimiento').value.trim();
                const cvv = document.getElementById('cvv').value.trim();
                const tipoTarjeta = document.querySelector('input[name="tipo-tarjeta"]:checked');
                if (!numeroTarjeta || !vencimiento || !cvv || !tipoTarjeta) {
                    alert('Por favor complete todos los datos de la tarjeta');
                    return false;
                }
                if (!/^\d{16}$/.test(numeroTarjeta)) {
                    alert('El número de tarjeta debe tener 16 dígitos');
                    return false;
                }
                pedido.pago = {
                    metodo: 'tarjeta',
                    tipo: tipoTarjeta.value,
                    ultimosDigitos: numeroTarjeta.slice(-4)
                };
            } else if (metodo === 'transferencia') {
                const banco = document.getElementById('banco').value;
                const numeroCuenta = document.getElementById('numero-cuenta').value.trim();
                const nombreDestinatario = document.getElementById('nombre-destinatario').value.trim();
                const referencia = document.getElementById('referencia-id').textContent;
                if (!banco || !numeroCuenta || !nombreDestinatario) {
                    alert('Por favor complete todos los datos de la transferencia');
                    return false;
                }
                if (!/^\d{10,20}$/.test(numeroCuenta)) {
                    alert('El número de cuenta debe tener entre 10 y 20 dígitos');
                    return false;
                }
                pedido.pago = {
                    metodo: 'transferencia',
                    banco: banco,
                    numeroCuenta: numeroCuenta.slice(-4),
                    nombreDestinatario: nombreDestinatario,
                    referencia: referencia
                };
            } else {
                alert('Seleccione un método de pago');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error procesando método de pago:', error);
            alert('Ocurrió un error al procesar el método de pago');
            return false;
        }
    }

    function completarPedido(cliente, total) {
        pedido.cliente = cliente;
        pedido.fecha = new Date().toLocaleString();
        pedido.numeroPedido = 'JP-' + Math.floor(Math.random() * 1000000);
        pedido.total = total;
        localStorage.setItem('pedidoCompletoJurassicPan', JSON.stringify(pedido));
        // Limpiar datos temporales
        ['nombre', 'telefono', 'correo'].forEach(campo => localStorage.removeItem(`cliente_${campo}`));
        limpiarPedido();
        window.location.href = 'ticket.html';
    }

    function guardarYRedirigir(destino) {
        localStorage.setItem('pedidoJurassicPan', JSON.stringify(pedido));
        window.location.href = destino;
    }

    function limpiarPedido() {
        localStorage.removeItem('pedidoJurassicPan');
    }

    function mostrarAlertaYRedirigir(mensaje, destino) {
        alert(mensaje);
        window.location.href = destino;
    }

    function generarReferencia() {
        return Math.floor(1000 + Math.random() * 9000);
    }
});
