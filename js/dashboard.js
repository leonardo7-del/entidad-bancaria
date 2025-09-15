document.addEventListener('DOMContentLoaded', function() {
    // Eliminar la 'x molesta' si existe
    
    if (closeMenu) {
        closeMenu.remove();
    }
    
    // Inicializar gráfico financiero
    initializeFinancialChart();
    
    // Configurar menú desplegable del perfil
    setupProfileDropdown();
    
    // Configurar eventos de botones
    setupButtonEvents();
});

// Inicializar gráfico financiero
function initializeFinancialChart() {
    const ctx = document.getElementById('financialSummaryChart');
    if (!ctx) return;
    
    try {
        // Crear gráfico con Chart.js
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [{
                    label: 'Ingresos',
                    data: [3200, 3500, 3700, 3900, 4100, 4050],
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 2
                }, {
                    label: 'Gastos',
                    data: [1800, 1900, 2100, 1950, 1850, 1716],
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    } catch (error) {
        console.error('Error al crear el gráfico:', error);
        
        // Si falla Chart.js, crear un gráfico básico con canvas
        try {
            const canvas = ctx;
            const context = canvas.getContext('2d');
            if (context) {
                // Limpiar el canvas
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                // Establecer dimensiones
                canvas.width = 600;
                canvas.height = 250;
                
                // Dibujar fondo
                context.fillStyle = '#f8f9fa';
                context.fillRect(0, 0, canvas.width, canvas.height);
                
                // Dibujar líneas de cuadrícula
                context.strokeStyle = '#e0e0e0';
                context.lineWidth = 1;
                
                // Líneas horizontales
                for (let i = 0; i < 5; i++) {
                    const y = 50 + i * 40;
                    context.beginPath();
                    context.moveTo(40, y);
                    context.lineTo(canvas.width - 20, y);
                    context.stroke();
                }
                
                // Dibujar línea de ingresos (verde)
                context.strokeStyle = 'rgba(46, 204, 113, 1)';
                context.lineWidth = 2;
                context.beginPath();
                context.moveTo(50, 180);
                context.lineTo(150, 160);
                context.lineTo(250, 140);
                context.lineTo(350, 120);
                context.lineTo(450, 100);
                context.lineTo(550, 105);
                context.stroke();
                
                // Dibujar línea de gastos (rojo)
                context.strokeStyle = 'rgba(231, 76, 60, 1)';
                context.lineWidth = 2;
                context.beginPath();
                context.moveTo(50, 200);
                context.lineTo(150, 190);
                context.lineTo(250, 170);
                context.lineTo(350, 180);
                context.lineTo(450, 185);
                context.lineTo(550, 190);
                context.stroke();
                
                // Leyenda
                context.fillStyle = '#333';
                context.font = '12px Arial';
                context.fillText('Ingresos', 50, 30);
                context.fillText('Gastos', 150, 30);
                
                // Indicadores de color
                context.fillStyle = 'rgba(46, 204, 113, 1)';
                context.fillRect(30, 22, 15, 10);
                context.fillStyle = 'rgba(231, 76, 60, 1)';
                context.fillRect(130, 22, 15, 10);
            }
        } catch (canvasError) {
            console.error('Error al crear gráfico de respaldo:', canvasError);
        }
    }
}

// Configurar menú desplegable del perfil
function setupProfileDropdown() {
    const userProfile = document.querySelector('.user-profile');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userProfile && dropdownMenu) {
        userProfile.addEventListener('click', function() {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!userProfile.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
    }
}

// Configurar eventos de botones
function setupButtonEvents() {
    // Botón de notificaciones
    const btnNotifications = document.getElementById('btnNotifications');
    if (btnNotifications) {
        btnNotifications.addEventListener('click', function() {
            alert('Notificaciones: Funcionalidad en desarrollo');
        });
    }
    
    // Botón de transferencia
    const btnTransfer = document.getElementById('btnTransfer');
    if (btnTransfer) {
        btnTransfer.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Transferencias: Funcionalidad en desarrollo');
        });
    }
    
    // Botón de cerrar sesión
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Cerrando sesión...');
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    // Botones de acceso rápido
    const quickAccessButtons = document.querySelectorAll('.quick-access-item');
    quickAccessButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                const feature = this.querySelector('.quick-access-label').textContent;
                alert(`${feature}: Funcionalidad en desarrollo`);
            }
        });
    });
}