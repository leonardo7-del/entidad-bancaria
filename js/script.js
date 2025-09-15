document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const loginBtn = document.querySelector('.btn-login');
    const modal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close');
    const contactForm = document.getElementById('contactForm');
    const loginForm = document.getElementById('loginForm');

    // Agregar clase 'close-menu' al menú móvil solo si no estamos en el dashboard
    if (nav && !window.location.href.includes('dashboard.html')) {
        const closeMenu = document.createElement('div');
        closeMenu.innerHTML = '&times;';
        nav.appendChild(closeMenu);

        // Toggle menú móvil
        menuToggle.addEventListener('click', function() {
            nav.classList.add('active');
        });

        closeMenu.addEventListener('click', function() {
            nav.classList.remove('active');
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
            });
        });
    }

    // Modal de login
    if (loginBtn && modal && closeBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'flex';
        });

        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Validación del formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const mensaje = document.getElementById('mensaje').value;
            
            if (nombre.trim() === '' || email.trim() === '' || mensaje.trim() === '') {
                showAlert('Por favor, complete todos los campos obligatorios.', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showAlert('Por favor, ingrese un email válido.', 'error');
                return;
            }
            
            // Simulación de envío exitoso
            showAlert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
            contactForm.reset();
        });
    }

    // Validación del formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username.trim() === '' || password.trim() === '') {
                showAlert('Por favor, ingrese su usuario y contraseña.', 'error');
                return;
            }
            
            // Simulación de login exitoso
            showAlert('Iniciando sesión...', 'success');
            
            // Redirigir a la página de dashboard después de un breve retraso
            setTimeout(function() {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }

    // Animación de scroll suave para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animación de elementos al hacer scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .benefit-item, .section-header');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };

    // Añadir clase para animación inicial
    document.querySelectorAll('.service-card, .benefit-item, .section-header').forEach(element => {
        element.classList.add('animate-ready');
    });

    // Ejecutar animación al cargar la página y al hacer scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // Funciones auxiliares
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showAlert(message, type) {
        // Crear elemento de alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        // Añadir al DOM
        document.body.appendChild(alertDiv);
        
        // Mostrar con animación
        setTimeout(() => {
            alertDiv.classList.add('show');
        }, 10);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(alertDiv);
            }, 300);
        }, 3000);
    }

    // Añadir estilos para las alertas dinámicamente
    const style = document.createElement('style');
    style.textContent = `
        .alert {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s, transform 0.3s;
            max-width: 300px;
        }
        
        .alert.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .alert-success {
            background-color: #4CAF50;
        }
        
        .alert-error {
            background-color: #F44336;
        }
        
        .animate-ready {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s, transform 0.6s;
        }
        
        .animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});