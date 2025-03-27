        const precios = {
            "Concha de vainilla": 8,
            "Concha de chocolate": 8,
            "Cocha de fresa": 8,
            "Cuernito": 7,
            "Mordida": 8,
            "Chocolatin": 10,
            "Corbata": 12,
            "Caracol": 14,
            "Pan de zarzamora": 16,
            "Taco": 10,
            "Oreja": 8,
            "Mariposa": 12,
            "Abanico": 10,
            "Riel": 9,
            "Broca": 11,
            "Mil hojas": 15,
            "Mantecada": 10,
            "Nuez": 12,
            "Vainilla": 10,
            "Chocolate": 12,
            "Queso": 14,
            "Marmol": 11,
            "Churros": 8,
            "Donas": 10,
            "Empanadas": 12,
            "Bolas de Berlin": 15,
            "Buñuelo": 9,
            "Bolillo": 7,
            "Baguette": 20,
            "Chapata": 18,
            "Pambazo": 10
        };

        function mostrarCamposPago() {
            const metodoPago = document.getElementById('metodo-pago').value;
            const efectivoDiv = document.getElementById('efectivo');
            const tarjetaDiv = document.getElementById('tarjeta');

            if (metodoPago === 'efectivo') {
                efectivoDiv.style.display = 'block';
                tarjetaDiv.style.display = 'none';
            } else if (metodoPago === 'tarjeta') {
                efectivoDiv.style.display = 'none';
                tarjetaDiv.style.display = 'block';
            }
        }

        function calcularCambio() {
            const total = parseFloat(document.getElementById('total-pedido').textContent.replace('Total: $', ''));
            const monto = parseFloat(document.getElementById('monto').value) || 0;
            
            if (monto >= total) {
                const cambio = monto - total;
                document.getElementById('cambio').textContent = `Cambio: $${cambio.toFixed(2)}`;
                document.getElementById('cambio-container').style.display = 'block';
            } else {
                document.getElementById('cambio-container').style.display = 'none';
            }
        }

        window.onload = function() {
            const urlParams = new URLSearchParams(window.location.search);
            const listaProductos = document.getElementById('lista-productos');
            let total = 0;

            const categorias = ['biscocho', 'feite', 'panque', 'fritos', 'salados'];
            
            categorias.forEach(categoria => {
                const productos = urlParams.getAll(`${categoria}[]`);
                const cantidades = urlParams.get(`cantidad-${categoria}`) ? 
                    urlParams.get(`cantidad-${categoria}`).split(',') : [];

                productos.forEach((productoConPrecio, index) => {
                    if (productoConPrecio && cantidades[index]) {
                        const [nombre, precio] = productoConPrecio.split('|');
                        const cantidad = parseInt(cantidades[index]);
                        const subtotal = cantidad * parseInt(precio);
                        total += subtotal;

                        const fila = document.createElement('tr');
                        
                        fila.innerHTML = `
                            <td>${nombre}</td>
                            <td>${cantidad}</td>
                            <td>$${precio}</td>
                            <td>$${subtotal}</td>
                        `;
                        
                        listaProductos.appendChild(fila);
                    }
                });
            });

            // Mostrar total
            document.getElementById('total-pedido').textContent = `Total: $${total.toFixed(2)}`;

            // Configurar campos de pago
            mostrarCamposPago();
        };

        document.getElementById('btn-generar-ticket').addEventListener('click', function() {
            if (!validarFormulario()) return;
            
            const pedido = {
                nombre: document.getElementById('nombre').value,
                fecha: document.getElementById('fecha').value,
                metodoPago: document.getElementById('metodo-pago').value,
                total: document.getElementById('total-pedido').textContent.replace('Total: $', ''),
                productos: []
            };

            const filas = document.querySelectorAll('#lista-productos tr');
            filas.forEach(fila => {
                const celdas = fila.cells;
                pedido.productos.push({
                    nombre: celdas[0].textContent,
                    cantidad: celdas[1].textContent,
                    precio: celdas[2].textContent.replace('$', ''),
                    subtotal: celdas[3].textContent.replace('$', '')
                });
            });

            if (pedido.metodoPago === 'efectivo') {
                pedido.montoRecibido = document.getElementById('monto').value;
                pedido.cambio = document.getElementById('cambio').textContent.replace('Cambio: $', '');
            } else {
                pedido.tarjeta = {
                    nombre: document.getElementById('nombre-tarjeta').value,
                    numero: document.getElementById('numero-tarjeta').value,
                    expiracion: document.getElementById('fecha-expiracion').value,
                    cvv: document.getElementById('codigo-seguridad').value
                };
            }

            // Guardar en localStorage
            localStorage.setItem('pedidoActual', JSON.stringify(pedido));
            
            // Redirigir a ticket.html
            window.location.href = 'ticket.html';
        });

        function validarFormulario() {
            if (document.getElementById('nombre').value.trim() === '') {
                alert('Por favor ingrese su nombre');
                return false;
            }
            
            if (document.getElementById('fecha').value === '') {
                alert('Por favor seleccione una fecha');
                return false;
            }
            
            const metodoPago = document.getElementById('metodo-pago').value;
            if (metodoPago === 'efectivo') {
                const monto = parseFloat(document.getElementById('monto').value);
                const total = parseFloat(document.getElementById('total-pedido').textContent.replace('Total: $', ''));
                
                if (isNaN(monto)) {
                    alert('Por favor ingrese un monto válido');
                    return false;
                }
                
                if (monto < total) {
                    alert('El monto recibido es menor que el total');
                    return false;
                }
            } else {
                if (document.getElementById('nombre-tarjeta').value.trim() === '' ||
                    document.getElementById('numero-tarjeta').value.length !== 16 ||
                    document.getElementById('fecha-expiracion').value === '' ||
                    document.getElementById('codigo-seguridad').value.length !== 3) {
                    alert('Por favor complete todos los datos de la tarjeta correctamente');
                    return false;
                }
            }
            
            return true;
        }
