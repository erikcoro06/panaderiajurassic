document.addEventListener('DOMContentLoaded', function() {
    // NAVBAR MENÚ MÓVIL HAMBURGUESA
    const toggle = document.getElementById('navbar-toggle');
    const menu = document.getElementById('navbar-menu');
    if(toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => menu.classList.remove('active'));
        });
    }

    // Notificación sencilla
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notificacion';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Botones + y -
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
            const complementoItem = this.closest('.complemento-item');
            const input = complementoItem.querySelector('.cantidad-input');
            if (parseInt(input.value) > 0) {
                this.classList.add('hidden');
                complementoItem.querySelector('.accion-btn.eliminar').classList.remove('hidden');
                showNotification('Agregado al pedido');
            } else {
                showNotification('Selecciona una cantidad mayor a 0');
            }
        });
    });

    // Botón Eliminar
    document.querySelectorAll('.accion-btn.eliminar').forEach(button => {
        button.addEventListener('click', function() {
            const complementoItem = this.closest('.complemento-item');
            const input = complementoItem.querySelector('.cantidad-input');
            input.value = 0;
            this.classList.add('hidden');
            complementoItem.querySelector('.accion-btn.agregar').classList.remove('hidden');
            showNotification('Eliminado del pedido');
        });
    });

    // Enlace "Datos del Cliente"
    const linkCliente = document.getElementById('link-cliente');
    if (linkCliente) {
        linkCliente.addEventListener('click', function(e) {
            e.preventDefault();
            guardarComplementosSeleccionadosYRedirigir();
        });
    }

    // Guardar selección en localStorage y redirigir
    function guardarComplementosSeleccionadosYRedirigir() {
        const complementosSeleccionados = [];
        document.querySelectorAll('.complemento-item').forEach(item => {
            const cantidad = parseInt(item.querySelector('.cantidad-input').value) || 0;
            if (cantidad > 0) {
                const nombre = item.dataset.complemento;
                const precio = parseFloat(item.dataset.precio);
                const subtotal = cantidad * precio;
                complementosSeleccionados.push({
                    nombre,
                    cantidad,
                    precio,
                    subtotal
                });
            }
        });

        if (complementosSeleccionados.length === 0) {
            alert('Por favor selecciona al menos un complemento');
            return;
        }

        // Leer el pedido existente en localStorage
        const pedidoGuardado = localStorage.getItem('pedidoJurassicPan');
        let pedidoActual = pedidoGuardado ? JSON.parse(pedidoGuardado) : { items: [] };

        // Fusionar productos (si ya existen, suma cantidades)
        complementosSeleccionados.forEach(nuevoComplemento => {
            const existente = pedidoActual.items.find(item => item.nombre === nuevoComplemento.nombre);
            if (existente) {
                existente.cantidad += nuevoComplemento.cantidad;
                existente.subtotal += nuevoComplemento.subtotal;
            } else {
                pedidoActual.items.push(nuevoComplemento);
            }
        });

        pedidoActual.total = pedidoActual.items.reduce((sum, item) => sum + item.subtotal, 0);

        localStorage.setItem('pedidoJurassicPan', JSON.stringify(pedidoActual));
        window.location.href = 'cliente.html';
    }
});