        document.addEventListener('DOMContentLoaded', function() {
            // Recuperar el pedido del localStorage
            const pedidoCompleto = localStorage.getItem('pedidoCompletoJurassicPan');
            
            if (pedidoCompleto) {
                const pedido = JSON.parse(pedidoCompleto);
                
                // Mostrar información general
                document.getElementById('pedido-numero').textContent = pedido.numeroPedido;
                document.getElementById('pedido-fecha').textContent = pedido.fecha;
                document.getElementById('pedido-cliente').textContent = pedido.cliente.nombre;
                document.getElementById('pedido-pago').textContent = pedido.pago.metodo.charAt(0).toUpperCase() + pedido.pago.metodo.slice(1);
                
                // Mostrar items del pedido
                const itemsContainer = document.getElementById('pedido-items');
                let total = 0;
                
                pedido.items.forEach(item => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${item.nombre}</td>
                        <td>${item.cantidad}</td>
                        <td class="price">$${item.precio.toFixed(2)}</td>
                    `;
                    itemsContainer.appendChild(fila);
                    total += item.subtotal;
                });
                
                // Mostrar total
                document.getElementById('pedido-total').textContent = `$${total.toFixed(2)}`;
                
                // Mostrar detalles de pago según el método
                const pagoDetalle = document.getElementById('pago-detalle');
                
                if (pedido.pago.metodo === 'efectivo') {
                    pagoDetalle.innerHTML = `
                        <div class="info-row">
                            <span class="info-label">Recibido:</span>
                            <span class="info-value">$${pedido.pago.montoRecibido.toFixed(2)}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Cambio:</span>
                            <span class="info-value">$${pedido.pago.cambio.toFixed(2)}</span>
                        </div>
                    `;
                } else if (pedido.pago.metodo === 'tarjeta') {
                    pagoDetalle.innerHTML = `
                        <div class="info-row">
                            <span class="info-label">Tarjeta:</span>
                            <span class="info-value">${pedido.pago.tipo} ****${pedido.pago.ultimosDigitos}</span>
                        </div>
                    `;
                } else if (pedido.pago.metodo === 'transferencia') {
                    pagoDetalle.innerHTML = `
                        <div class="info-row">
                            <span class="info-label">Banco:</span>
                            <span class="info-value">${pedido.pago.banco}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Referencia:</span>
                            <span class="info-value">${pedido.pago.referencia}</span>
                        </div>
                    `;
                }
                
                // Configurar impresión
                const btnPrint = document.querySelector('.btn-print');
                btnPrint.addEventListener('click', function() {
                    window.print();
                });
                
            } else {
                // Si no hay pedido, redirigir al catálogo
                window.location.href = 'pan.html';
            }
        });