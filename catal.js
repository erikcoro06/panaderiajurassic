document.addEventListener('DOMContentLoaded', function() {
            // Obtener datos del pedido desde localStorage
            const pedido = JSON.parse(localStorage.getItem('pedidoActual'));
            
         
            
            // Generar número de ticket
            const ticketNum = 'JP-' + Date.now().toString().slice(-6);
            
            // Mostrar información del cliente
            document.getElementById('fecha').textContent = pedido.fecha;
            document.getElementById('cliente').textContent = pedido.nombre;
            document.getElementById('ticket-num').textContent = ticketNum;
            
            // Mostrar productos
            const tbody = document.querySelector('#productos tbody');
            pedido.productos.forEach(producto => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${producto.subtotal}</td>
                `;
                tbody.appendChild(tr);
            });
            
            // Mostrar total
            document.getElementById('total').textContent = pedido.total;
            
            // Mostrar método de pago
            document.getElementById('metodo').textContent = pedido.metodoPago === 'efectivo' ? 'Efectivo' : 'Tarjeta';
            
            if (pedido.metodoPago === 'efectivo') {
                document.getElementById('efectivo-info').style.display = 'block';
                document.getElementById('recibido').textContent = pedido.montoRecibido;
                document.getElementById('cambio').textContent = pedido.cambio;
            } else {
                document.getElementById('tarjeta-info').style.display = 'block';
                document.getElementById('tarjeta-digitos').textContent = pedido.tarjeta.numero.slice(-4);
            }
            
            // Limpiar localStorage después de mostrar
            localStorage.removeItem('pedidoActual');
        });