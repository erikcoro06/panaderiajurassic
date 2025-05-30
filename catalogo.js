document.addEventListener('DOMContentLoaded', function() {
    // Notificación sencilla
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notificacion';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    // Botón +
    document.querySelectorAll('.cantidad-btn.aumentar').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.cantidad-input');
            input.value = parseInt(input.value) + 1;
        });
    });

    // Botón -
    document.querySelectorAll('.cantidad-btn.disminuir').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.cantidad-input');
            input.value = Math.max(0, parseInt(input.value) - 1);
        });
    });

    // Solo números positivos en input
    document.querySelectorAll('.cantidad-input').forEach(input => {
        input.addEventListener('input', function() {
            let val = parseInt(this.value.replace(/\D/g, ''));
            if (isNaN(val) || val < 0) val = 0;
            this.value = val;
        });
    });

    // Botón Agregar
    document.querySelectorAll('.accion-btn.agregar').forEach(button => {
        button.addEventListener('click', function() {
            const panItem = this.closest('.pan-item');
            const input = panItem.querySelector('.cantidad-input');
            if (parseInt(input.value) > 0) {
                this.classList.add('hidden');
                panItem.querySelector('.accion-btn.eliminar').classList.remove('hidden');
                showNotification('Agregado al pedido');
            } else {
                showNotification('Selecciona una cantidad mayor a 0');
            }
        });
    });

    // Botón Eliminar
    document.querySelectorAll('.accion-btn.eliminar').forEach(button => {
        button.addEventListener('click', function() {
            const panItem = this.closest('.pan-item');
            const input = panItem.querySelector('.cantidad-input');
            input.value = 0;
            this.classList.add('hidden');
            panItem.querySelector('.accion-btn.agregar').classList.remove('hidden');
            showNotification('Eliminado del pedido');
        });
    });

    // Añadir enlace para "Datos del Cliente"
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
        document.querySelectorAll('.pan-item').forEach(item => {
            const cantidad = parseInt(item.querySelector('.cantidad-input').value) || 0;
            if (cantidad > 0) {
                const nombre = item.getAttribute('data-pan');
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
