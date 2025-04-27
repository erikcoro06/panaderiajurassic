document.addEventListener('DOMContentLoaded', function() {
    // Función para manejar el botón de agregar/eliminar
    document.querySelectorAll('.accion-btn.agregar').forEach(btn => {
        btn.addEventListener('click', function() {
            const pastelItem = this.closest('.pastel-item');
            const eliminarBtn = pastelItem.querySelector('.eliminar');
            
            this.classList.add('hidden');
            eliminarBtn.classList.remove('hidden');
            
            const cantidadInput = pastelItem.querySelector('.cantidad-input');
            if (cantidadInput.value == 0) {
                cantidadInput.value = 1;
            }
        });
    });
    
    // Función para manejar el botón de eliminar
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
                
                if (input.value == 0) {
                    const pastelItem = this.closest('.pastel-item');
                    const agregarBtn = pastelItem.querySelector('.agregar');
                    const eliminarBtn = pastelItem.querySelector('.eliminar');
                    
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
    
    // Manejar el botón de continuar
    document.getElementById('continuar-btn').addEventListener('click', function() {
        const nuevosPasteles = {
            items: [],
            total: 0,
            tipo: "pasteles" // Para identificar que es un pedido de pasteles
        };
        
        // Recolectar todos los pasteles con cantidad > 0
        document.querySelectorAll('.pastel-item').forEach(pastelItem => {
            const cantidad = parseInt(pastelItem.querySelector('.cantidad-input').value);
            if (cantidad > 0) {
                const nombre = pastelItem.dataset.pastel;
                const precio = parseFloat(pastelItem.dataset.precio);
                const subtotal = cantidad * precio;
                
                nuevosPasteles.items.push({
                    nombre: nombre,
                    cantidad: cantidad,
                    precio: precio,
                    subtotal: subtotal
                });
                
                nuevosPasteles.total += subtotal;
            }
        });
        
        // Validar que se haya seleccionado al menos un pastel
        if (nuevosPasteles.items.length === 0) {
            alert('Por favor selecciona al menos un pastel antes de continuar.');
            return;
        }
        
        // Leer el pedido existente en localStorage
        const pedidoGuardado = localStorage.getItem('pedidoJurassicPan');
        let pedidoActual = pedidoGuardado ? JSON.parse(pedidoGuardado) : { items: [] };

        // Fusionar los productos actuales con los ya existentes
        nuevosPasteles.items.forEach(nuevoProducto => {
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
