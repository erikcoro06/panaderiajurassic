document.addEventListener('DOMContentLoaded', function() {
    // Función para manejar el botón de agregar/eliminar
    document.querySelectorAll('.accion-btn.agregar').forEach(btn => {
        btn.addEventListener('click', function() {
            const panItem = this.closest('.pan-item');
            const eliminarBtn = panItem.querySelector('.eliminar');
            
            // Cambiar visibilidad de botones
            this.classList.add('hidden');
            eliminarBtn.classList.remove('hidden');
            
            // Asegurar que la cantidad sea al menos 1
            const cantidadInput = panItem.querySelector('.cantidad-input');
            if (cantidadInput.value == 0) {
                cantidadInput.value = 1;
            }
        });
    });
    
    // Función para manejar el botón de eliminar
    document.querySelectorAll('.accion-btn.eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const panItem = this.closest('.pan-item');
            const agregarBtn = panItem.querySelector('.agregar');
            
            // Cambiar visibilidad de botones
            this.classList.add('hidden');
            agregarBtn.classList.remove('hidden');
            
            // Resetear cantidad a 0
            const cantidadInput = panItem.querySelector('.cantidad-input');
            cantidadInput.value = 0;
        });
    });
    
    // Función para aumentar cantidad
    document.querySelectorAll('.cantidad-btn.aumentar').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.cantidad-input');
            input.value = parseInt(input.value) + 1;
        });
    });
    
    // Función para disminuir cantidad
    document.querySelectorAll('.cantidad-btn.disminuir').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.cantidad-input');
            if (parseInt(input.value) > 0) {
                input.value = parseInt(input.value) - 1;
                
                // Si llega a 0, cambiar a botón de agregar
                if (input.value == 0) {
                    const panItem = this.closest('.pan-item');
                    const agregarBtn = panItem.querySelector('.agregar');
                    const eliminarBtn = panItem.querySelector('.eliminar');
                    
                    agregarBtn.classList.remove('hidden');
                    eliminarBtn.classList.add('hidden');
                }
            }
        });
    });
    
    // Validar que no se puedan introducir números negativos manualmente
    document.querySelectorAll('.cantidad-input').forEach(input => {
        input.addEventListener('change', function() {
            if (parseInt(this.value) < 0) {
                this.value = 0;
            }
        });
    });
    
    // Manejar el botón "Continuar con datos del cliente"
    document.querySelector('button[onclick*="cliente.html"]').addEventListener('click', function() {
        const nuevosPanes = {
            items: [],
            total: 0,
            fecha: new Date().toLocaleString(),
            tipo: "panes" // Para identificar que es un pedido de panes
        };
        
        // Recolectar todos los panes con cantidad > 0
        document.querySelectorAll('.pan-item').forEach(panItem => {
            const cantidad = parseInt(panItem.querySelector('.cantidad-input').value);
            if (cantidad > 0) {
                const nombre = panItem.dataset.pan;
                const precio = parseFloat(panItem.dataset.precio);
                const subtotal = cantidad * precio;
                
                nuevosPanes.items.push({
                    nombre: nombre,
                    cantidad: cantidad,
                    precio: precio,
                    subtotal: subtotal
                });
                
                nuevosPanes.total += subtotal;
            }
        });
        
        // Validar que se haya seleccionado al menos un pan
        if (nuevosPanes.items.length === 0) {
            alert('Por favor selecciona al menos un pan antes de continuar.');
            return;
        }
        
        // Leer el pedido existente en localStorage
        const pedidoGuardado = localStorage.getItem('pedidoJurassicPan');
        let pedidoActual = pedidoGuardado ? JSON.parse(pedidoGuardado) : { items: [] };

        // Fusionar los productos actuales con los ya existentes
        nuevosPanes.items.forEach(nuevoProducto => {
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