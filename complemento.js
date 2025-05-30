document.addEventListener('DOMContentLoaded', function() {
    // --- NAVBAR MENÚ MÓVIL HAMBURGUESA ---
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

    // --- LÓGICA DE COMPLEMENTOS ---
    document.querySelectorAll('.product-card').forEach(card => {
        const minusBtn = card.querySelector('.quantity-btn.minus');
        const plusBtn = card.querySelector('.quantity-btn.plus');
        const input = card.querySelector('.quantity-input');
        const addBtn = card.querySelector('.add-to-cart:not(.remove-btn)');
        const removeBtn = card.querySelector('.add-to-cart.remove-btn');

        // Botón +
        plusBtn.addEventListener('click', () => {
            input.value = parseInt(input.value) + 1;
            updateButtons();
        });

        // Botón -
        minusBtn.addEventListener('click', () => {
            input.value = Math.max(0, parseInt(input.value) - 1);
            updateButtons();
        });

        // Cambios directos en input
        input.addEventListener('input', () => {
            let val = parseInt(input.value.replace(/\D/g, ''));
            if (isNaN(val) || val < 0) val = 0;
            input.value = val;
            updateButtons();
        });

        // Botón Agregar
        addBtn.addEventListener('click', () => {
            input.value = Math.max(1, parseInt(input.value) || 0);
            updateButtons();
            showNotification("Producto agregado al pedido");
        });

        // Botón Eliminar
        removeBtn.addEventListener('click', () => {
            input.value = 0;
            updateButtons();
            showNotification("Producto eliminado del pedido");
        });

        function updateButtons() {
            if (parseInt(input.value) > 0) {
                addBtn.style.display = 'none';
                removeBtn.style.display = 'inline-block';
            } else {
                addBtn.style.display = 'inline-block';
                removeBtn.style.display = 'none';
            }
        }
    });

    // --- Notificación visual sencilla ---
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notificacion';
        notification.textContent = message;
        Object.assign(notification.style, {
            position: 'fixed',
            top: '15px',
            right: '15px',
            background: '#231f20',
            color: '#fff',
            padding: '14px 24px',
            borderRadius: '8px',
            fontSize: '1em',
            zIndex: 10000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.14)'
        });
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }
});
