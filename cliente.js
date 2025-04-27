document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const tablaProductos = document.getElementById('tabla-productos');
    const totalPedidoElement = document.getElementById('total-pedido');
    const efectivoSection = document.getElementById('efectivo-section');
    const tarjetaSection = document.getElementById('tarjeta-section');
    const transferenciaSection = document.getElementById('transferencia-section');
    const mensajeCambio = document.getElementById('mensaje-cambio');
    const formDatosCliente = document.getElementById('datos-cliente');

    // Botones de navegación
    const btnPanes = document.getElementById('btn-panes');
    const btnPasteles = document.getElementById('btn-pasteles');
    const btnComplementos = document.getElementById('btn-complementos');
    const btnVolver = document.getElementById('btn-volver');

    // Recuperar el pedido del localStorage
    const pedidoGuardado = localStorage.getItem('pedidoJurassicPan');
    let pedido = pedidoGuardado ? JSON.parse(pedidoGuardado) : { items: [] };

    // Verificar si hay pedido válido
    if (!pedido || !pedido.items || pedido.items.length === 0) {
        mostrarAlertaYRedirigir('No hay productos en tu pedido. Serás redirigido al catálogo.', 'pan.html');
        return;
    }

    // Mostrar productos en la tabla
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

    // Configurar métodos de pago
    configurarMetodosPago(totalPedido);

    // Configurar navegación
    configurarNavegacion();

    // Configurar envío del formulario
    formDatosCliente.addEventListener('submit', function(e) {
        e.preventDefault();
        procesarPedido(totalPedido);
    });

    // ===== FUNCIONES PRINCIPALES =====

    function configurarMetodosPago(total) {
        // Cambio entre métodos de pago
        document.querySelectorAll('input[name="metodo-pago"]').forEach(radio => {
            radio.addEventListener('change', function() {
                efectivoSection.classList.add('hidden');
                tarjetaSection.classList.add('hidden');
                transferenciaSection.classList.add('hidden');
                
                if (this.value === 'efectivo') {
                    efectivoSection.classList.remove('hidden');
                    configurarEfectivo(total);
                } else if (this.value === 'tarjeta') {
                    tarjetaSection.classList.remove('hidden');
                } else if (this.value === 'transferencia') {
                    transferenciaSection.classList.remove('hidden');
                    document.getElementById('monto-transferencia').value = total.toFixed(2);
                    document.getElementById('referencia-id').textContent = Math.floor(1000 + Math.random() * 9000);
                }
            });
        });

        // Configurar sección de efectivo
        configurarEfectivo(total);
    }

    function configurarEfectivo(total) {
        const montoInput = document.getElementById('monto-efectivo');
        
        function calcularCambio(montoEfectivo) {
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
        
        // Botones de denominación
        document.querySelectorAll('.btn-denominacion').forEach(btn => {
            btn.addEventListener('click', function() {
                const monto = parseFloat(this.dataset.monto);
                montoInput.value = monto;
                calcularCambio(monto);
            });
        });
        
        // Input manual
        montoInput.addEventListener('input', function() {
            const monto = parseFloat(this.value) || 0;
            calcularCambio(monto);
        });
        
        // Calcular cambio inicial
        calcularCambio(parseFloat(montoInput.value) || 0);
    }

    function configurarNavegacion() {
        btnPanes.addEventListener('click', () => guardarYRedirigir('catalogo.html'));
        btnPasteles.addEventListener('click', () => guardarYRedirigir('pastel.html'));
        btnComplementos.addEventListener('click', () => guardarYRedirigir('complementos.html'));
        btnVolver.addEventListener('click', () => {
            limpiarPedido();
            window.location.href = 'pan.html';
        });
    }

    function procesarPedido(total) {
        const cliente = {
            nombre: document.getElementById('nombre').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            correo: document.getElementById('correo').value.trim() || 'No proporcionado',
            metodoPago: document.querySelector('input[name="metodo-pago"]:checked').value
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
                if (!numeroTarjeta || !vencimiento || !cvv) {
                    alert('Por favor complete todos los datos de la tarjeta');
                    return false;
                }
                pedido.pago = {
                    metodo: 'tarjeta',
                    tipo: document.querySelector('input[name="tipo-tarjeta"]:checked').value,
                    ultimosDigitos: numeroTarjeta.slice(-4)
                };
            } else if (metodo === 'transferencia') {
                const banco = document.getElementById('banco').value;
                const numeroCuenta = document.getElementById('numero-cuenta').value.trim();
                const nombreDestinatario = document.getElementById('nombre-destinatario').value.trim();
                if (!banco || !numeroCuenta || !nombreDestinatario) {
                    alert('Por favor complete todos los datos de la transferencia');
                    return false;
                }
                pedido.pago = {
                    metodo: 'transferencia',
                    banco: banco,
                    numeroCuenta: numeroCuenta.slice(-4),
                    nombreDestinatario: nombreDestinatario,
                    referencia: document.getElementById('referencia-id').textContent
                };
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
});