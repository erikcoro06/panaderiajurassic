document.addEventListener('DOMContentLoaded', function() {
    // Función para mostrar notificaciones
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notificacion';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    // Manejar eventos de los botones de cantidad (+ y -)
    document.querySelectorAll('.cantidad-btn.aumentar').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.cantidad-input');
            input.value = parseInt(input.value) + 1;
        });
    });
    document.querySelectorAll('.cantidad-btn.disminuir').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.cantidad-input');
            input.value = Math.max(0, parseInt(input.value) - 1);
        });
    });

    // Prevenir valores negativos desde el input
    document.querySelectorAll('.cantidad-input').forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 0) this.value = 0;
        });
    });

    // Botón Agregar
    document.querySelectorAll('.accion-btn.agregar').forEach(button => {
        button.addEventListener('click', function() {
            const panItem = this.closest('.pan-item');
            const nombre = panItem.getAttribute('data-pan');
            const precio = parseFloat(panItem.getAttribute('data-precio'));
            const input = panItem.querySelector('.cantidad-input');
            const cantidad = parseInt(input.value);

            if (!cantidad || cantidad < 1) {
                alert('Selecciona una cantidad mayor a 0.');
                return;
            }

            let pedido = JSON.parse(localStorage.getItem('pedidoJurassicPan')) || {items: []};
            let idx = pedido.items.findIndex(item => item.nombre === nombre);
            if (idx >= 0) {
                pedido.items[idx].cantidad += cantidad;
                pedido.items[idx].subtotal = pedido.items[idx].cantidad * precio;
            } else {
                pedido.items.push({
                    nombre: nombre,
                    cantidad: cantidad,
                    precio: precio,
                    subtotal: cantidad * precio
                });
            }
            pedido.total = pedido.items.reduce((sum, item) => sum + item.subtotal, 0);
            localStorage.setItem('pedidoJurassicPan', JSON.stringify(pedido));

            input.disabled = true;
            button.classList.add('hidden');
            panItem.querySelector('.accion-btn.eliminar').classList.remove('hidden');

            showNotification(`${cantidad} × ${nombre} agregado`);
        });
    });

    // Botón Eliminar
    document.querySelectorAll('.accion-btn.eliminar').forEach(button => {
        button.addEventListener('click', function() {
            const panItem = this.closest('.pan-item');
            const nombre = panItem.getAttribute('data-pan');
            const input = panItem.querySelector('.cantidad-input');

            let pedido = JSON.parse(localStorage.getItem('pedidoJurassicPan')) || {items: []};
            pedido.items = pedido.items.filter(item => item.nombre !== nombre);
            pedido.total = pedido.items.reduce((sum, item) => sum + item.subtotal, 0);
            localStorage.setItem('pedidoJurassicPan', JSON.stringify(pedido));

            input.disabled = false;
            input.value = 0;
            this.classList.add('hidden');
            panItem.querySelector('.accion-btn.agregar').classList.remove('hidden');

            showNotification(`${nombre} eliminado del pedido`);
        });
    });

    // Reflejar panes ya seleccionados al recargar
    const pedido = JSON.parse(localStorage.getItem('pedidoJurassicPan')) || {items: []};
    pedido.items.forEach(item => {
        const panItem = document.querySelector(`.pan-item[data-pan="${item.nombre}"]`);
        if (panItem) {
            const input = panItem.querySelector('.cantidad-input');
            input.value = item.cantidad;
            input.disabled = true;
            panItem.querySelector('.accion-btn.agregar').classList.add('hidden');
            panItem.querySelector('.accion-btn.eliminar').classList.remove('hidden');
        }
    });

    // Interceptar enlace a "Datos del Cliente"
    const linkCliente = document.getElementById('link-cliente');
    if (linkCliente) {
        linkCliente.addEventListener('click', function(e) {
            const pedido = JSON.parse(localStorage.getItem('pedidoJurassicPan')) || {items: []};
            if (!pedido.items.length) {
                e.preventDefault();
                alert('Selecciona al menos un pan para continuar.');
            }
        });
    }
});
