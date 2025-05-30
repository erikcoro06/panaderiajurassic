document.addEventListener('DOMContentLoaded', function() {
    // Notificación sencilla
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notificacion';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    // Botones + y -
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            input.value = parseInt(input.value) + 1;
        });
    });

    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            input.value = Math.max(0, parseInt(input.value) - 1);
        });
    });

    // Solo números positivos en input
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('input', function() {
            let val = parseInt(this.value.replace(/\D/g, ''));
            if (isNaN(val) || val < 0) val = 0;
            this.value = val;
        });
    });

    // Botón Agregar
    document.querySelectorAll('.add-to-cart:not(.remove-btn)').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const input = productCard.querySelector('.quantity-input');
            if (parseInt(input.value) > 0) {
                this.style.display = 'none';
                productCard.querySelector('.add-to-cart.remove-btn').style.display = '';
                showNotification('Agregado al pedido');
            } else {
                showNotification('Selecciona una cantidad mayor a 0');
            }
        });
    });

    // Botón Eliminar
    document.querySelectorAll('.add-to-cart.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const input = productCard.querySelector('.quantity-input');
            input.value = 0;
            this.style.display = 'none';
            productCard.querySelector('.add-to-cart:not(.remove-btn)').style.display = '';
            showNotification('Eliminado del pedido');
        });
    });

    // Agregar data-producto y data-precio dinámicamente
    document.querySelectorAll('.product-card').forEach(card => {
        const nombre = card.querySelector('.product-name')?.textContent?.trim() || '';
        const precio = parseFloat(card.querySelector('.product-price')?.textContent) || 0;
        card.setAttribute('data-producto', nombre);
        card.setAttribute('data-precio', precio);
    });

    // Añadir enlace para "Datos del Cliente"
    // Busca el enlace del navbar que va a cliente.html
    const links = Array.from(document.querySelectorAll('a')).filter(a => a.getAttribute('href') === 'cliente.html');
    let linkCliente = links[0];
    if (linkCliente) {
        linkCliente.id = 'link-cliente';
        linkCliente.addEventListener('click', function(e) {
            e.preventDefault();
            guardarProductosSeleccionadosYRedirigir();
        });
    }

    // Guardar selección en localStorage y redirigir
    function guardarProductosSeleccionadosYRedirigir() {
        const productosSeleccionados = [];
        document.querySelectorAll('.product-card').forEach(item => {
            const cantidad = parseInt(item.querySelector('.quantity-input').value) || 0;
            if (cantidad > 0) {
                const nombre = item.getAttribute('data-producto');
                const precio = parseFloat(item.getAttribute('data-precio'));
                const subtotal = cantidad * precio;
                productosSeleccionados.push({
                    nombre,
                    cantidad,
                    precio,
                    subtotal
                });
            }
        });

        if (productosSeleccionados.length === 0) {
            alert('Por favor selecciona al menos un producto');
            return;
        }

        // Leer el pedido existente en localStorage
        const pedidoGuardado = localStorage.getItem('pedidoJurassicPan');
        let pedidoActual = pedidoGuardado ? JSON.parse(pedidoGuardado) : { items: [] };

        // Fusionar productos repetidos (sumar cantidades y subtotales)
        productosSeleccionados.forEach(nuevoProducto => {
            const existente = pedidoActual.items.find(item => item.nombre === nuevoProducto.nombre);
            if (existente) {
                existente.cantidad += nuevoProducto.cantidad;
                existente.subtotal += nuevoProducto.subtotal;
            } else {
                pedidoActual.items.push(nuevoProducto);
            }
        });

        pedidoActual.total = pedidoActual.items.reduce((sum, item) => sum + item.subtotal, 0);

        localStorage.setItem('pedidoJurassicPan', JSON.stringify(pedidoActual));
        window.location.href = 'cliente.html';
    }
});
