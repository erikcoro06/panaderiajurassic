document.addEventListener('DOMContentLoaded', function() {
    // Mostrar notificaciones simples
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notificacion';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2500);
    }

    // Botón agregar pastel
    document.querySelectorAll('.accion-btn.agregar').forEach(btn => {
        btn.addEventListener('click', function() {
            const pastelItem = this.closest('.pastel-item');
            const eliminarBtn = pastelItem.querySelector('.eliminar');
            this.classList.add('hidden');
            eliminarBtn.classList.remove('hidden');
            const cantidadInput = pastelItem.querySelector('.cantidad-input');
            if (parseInt(cantidadInput.value) === 0) {
                cantidadInput.value = 1;
            }
        });
    });

    // Botón eliminar pastel
    document.querySelectorAll('.accion-btn.eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const pastelItem = this.closest('.pastel-item');
            const agregarBtn = pastelItem.querySelector('.agregar');
            this.classList.add('hidden');
            agregarBtn.classList.remove('hidden');
            const cantidadInput = pastelItem.querySelector('.cantidad-input');
            cantidadInput.value = 0;
        });
    });

    // Botón aumentar cantidad
    document.querySelectorAll('.cantidad-btn.aumentar').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.cantidad-input');
            input.value = parseInt(input.value) + 1;
        });
    });

    // Botón disminuir cantidad
    document.querySelectorAll('.cantidad-btn.disminuir').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.cantidad-input');
            if (parseInt(input.value) > 0) {
                input.value = parseInt(input.value) - 1;
                if (parseInt(input.value) === 0) {
                    const pastelItem = this.closest('.pastel-item');
                    const agregarBtn = pastelItem.querySelector('.agregar');
                    const eliminarBtn = pastelItem.querySelector('.eliminar');
                    agregarBtn.classList.remove('hidden');
                    eliminarBtn.classList.add('hidden');
                }
            }
        });
    });

    // Prevenir valores negativos manualmente
    document.querySelectorAll('.cantidad-input').forEach(input => {
        input.addEventListener('change', function() {
            if (parseInt(this.value) < 0 || isNaN(parseInt(this.value))) {
                this.value = 0;
            }
        });
    });

    // Botón continuar
    const continuarBtn = document.getElementById('continuar-btn');
    if (continuarBtn) {
        continuarBtn.addEventListener('click', function() {
            guardarPastelesSeleccionadosYRedirigir();
        });
    }

    // Menú "Datos del Cliente"
    const linkCliente = document.getElementById('link-cliente');
    if (linkCliente) {
        linkCliente.addEventListener('click', function(e) {
            e.preventDefault();
            guardarPastelesSeleccionadosYRedirigir();
        });
    }
});

function guardarPastelesSeleccionadosYRedirigir() {
    // Recolectar los pasteles seleccionados
    const pastelesSeleccionados = [];
    document.querySelectorAll('.pastel-item').forEach(pastelItem => {
        const cantidadInput = pastelItem.querySelector('.cantidad-input');
        const cantidad = parseInt(cantidadInput.value);
        if (cantidad > 0) {
            const nombre = pastelItem.getAttribute('data-pastel') || pastelItem.dataset.pastel;
            const precio = parseFloat(pastelItem.getAttribute('data-precio') || pastelItem.dataset.precio);
            const subtotal = cantidad * precio;
            pastelesSeleccionados.push({
                nombre: nombre,
                cantidad: cantidad,
                precio: precio,
                subtotal: subtotal
            });
        }
    });

    if (pastelesSeleccionados.length === 0) {
        alert('Por favor selecciona al menos un pastel antes de continuar.');
        return;
    }

    // Leer pedido existente
    const pedidoGuardado = localStorage.getItem('pedidoJurassicPan');
    let pedidoActual = pedidoGuardado ? JSON.parse(pedidoGuardado) : { items: [] };

    // Fusionar productos
    pastelesSeleccionados.forEach(nuevoPastel => {
        const existente = pedidoActual.items.find(item => item.nombre === nuevoPastel.nombre);
        if (existente) {
            existente.cantidad += nuevoPastel.cantidad;
            existente.subtotal += nuevoPastel.subtotal;
        } else {
            pedidoActual.items.push(nuevoPastel);
        }
    });

    pedidoActual.total = pedidoActual.items.reduce((sum, item) => sum + item.subtotal, 0);

    localStorage.setItem('pedidoJurassicPan', JSON.stringify(pedidoActual));
    window.location.href = 'cliente.html';
}
