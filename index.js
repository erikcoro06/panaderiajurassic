        document.addEventListener('DOMContentLoaded', function() {
            // Actualizar año automáticamente
            document.getElementById('current-year').textContent = new Date().getFullYear();
            
            // Efecto hover para botones principales
            const buttons = document.querySelectorAll('.restaurant-btn');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                });
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
            
            // Simular carga progresiva
            const elements = document.querySelectorAll('h1, h2, nav, .social-footer');
            elements.forEach((el, index) => {
                el.style.animationDelay = `${index * 0.15}s`;
            });
        });
