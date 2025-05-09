document.addEventListener('DOMContentLoaded', function() {
    // Función para mostrar notificaciones
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notificacion';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Manejar eventos de los botones de cantidad
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (this.classList.contains('plus')) {
                input.value = value + 1;
            } else if (this.classList.contains('minus') && value > 0) {
                input.value = value - 1;
            }
            
            // Actualizar estado de los botones
            updateCartButtonState(input);
        });
    });
    
    // Manejar cambios en los inputs de cantidad
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 0) this.value = 0;
            updateCartButtonState(this);
        });
    });
    
    // Función para actualizar estado de los botones Agregar/Eliminar
    function updateCartButtonState(input) {
        const card = input.closest('.product-card');
        const addBtn = card.querySelector('.add-to-cart:not(.remove-btn)');
        const removeBtn = card.querySelector('.remove-btn');
        const quantity = parseInt(input.value);
        
        if (quantity > 0) {
            addBtn.style.display = 'none';
            removeBtn.style.display = 'block';
        } else {
            addBtn.style.display = 'block';
            removeBtn.style.display = 'none';
        }
    }
    
    // Manejar evento de clic en botón Agregar
    document.querySelectorAll('.add-to-cart:not(.remove-btn)').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.closest('.product-info').querySelector('.quantity-input');
            input.value = parseInt(input.value) + 1;
            updateCartButtonState(input);
            showNotification('Producto agregado al carrito');
        });
    });
    
    // Manejar evento de clic en botón Eliminar
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.closest('.product-info').querySelector('.quantity-input');
            input.value = 0;
            updateCartButtonState(input);
            showNotification('Producto eliminado del carrito');
        });
    });
    
    // Funcionalidad del botón Finalizar Compra
    document.getElementById('btn-finalizar').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Recopilar todos los productos seleccionados
        const productosSeleccionados = [];
        let totalPedido = 0;
        
        document.querySelectorAll('.product-card').forEach(card => {
            const cantidad = parseInt(card.querySelector('.quantity-input').value);
            if (cantidad > 0) {
                const nombre = card.querySelector('.product-name').textContent;
                const precio = parseFloat(card.querySelector('.product-price').textContent);
                const subtotal = precio * cantidad;
                
                productosSeleccionados.push({
                    nombre: nombre,
                    cantidad: cantidad,
                    precio: precio,
                    subtotal: subtotal
                });
                
                totalPedido += subtotal;
            }
        });
        
        if (productosSeleccionados.length === 0) {
            showNotification('Por favor selecciona al menos un producto');
            return;
        }
        
        // Leer el pedido existente en localStorage
        const pedidoGuardado = localStorage.getItem('pedidoJurassicPan');
        let pedidoActual = pedidoGuardado ? JSON.parse(pedidoGuardado) : { items: [] };

        // Fusionar los productos actuales con los ya existentes
        productosSeleccionados.forEach(nuevoProducto => {
            const productoExistente = pedidoActual.items.find(item => item.nombre === nuevoProducto.nombre);
            if (productoExistente) {
                // Si el producto ya existe, sumar cantidades y subtotales
                productoExistente.cantidad += nuevoProducto.cantidad;
                productoExistente.subtotal += nuevoProducto.subtotal;
            } else {
                // Si no existe, agregarlo al pedido
                pedidoActual.items.push(nuevoProducto);
            }
        });

        // Actualizar el total del pedido
        pedidoActual.total = pedidoActual.items.reduce((sum, item) => sum + item.subtotal, 0);

        // Guardar el pedido actualizado en localStorage
        localStorage.setItem('pedidoJurassicPan', JSON.stringify(pedidoActual));

        // Redirigir a la página de datos del cliente
        window.location.href = 'cliente.html';
    });
});