document.addEventListener('DOMContentLoaded', function() {
    // Datos simulados de la cuenta
    const accountData = {
        name: 'Juan Pérez',
        accountNumber: '******4567',
        balance: 5842.75,
        currency: '€',
        transactions: [
            { date: '2023-06-15', concept: 'Nómina', category: 'Ingresos', amount: 1850.00, type: 'income' },
            { date: '2023-06-14', concept: 'Supermercado El Corte Inglés', category: 'Alimentación', amount: -125.45, type: 'expense' },
            { date: '2023-06-12', concept: 'Transferencia a María López', category: 'Transferencias', amount: -350.00, type: 'expense' },
            { date: '2023-06-10', concept: 'Restaurante La Tasca', category: 'Ocio', amount: -58.30, type: 'expense' },
            { date: '2023-06-08', concept: 'Retirada Cajero', category: 'Efectivo', amount: -200.00, type: 'expense' },
            { date: '2023-06-05', concept: 'Factura Electricidad', category: 'Hogar', amount: -87.65, type: 'expense' },
            { date: '2023-06-03', concept: 'Ingreso Cheque', category: 'Ingresos', amount: 350.00, type: 'income' },
            { date: '2023-06-01', concept: 'Hipoteca', category: 'Vivienda', amount: -650.00, type: 'expense' },
            { date: '2023-05-28', concept: 'Seguro Coche', category: 'Seguros', amount: -245.00, type: 'expense' },
            { date: '2023-05-25', concept: 'Nómina', category: 'Ingresos', amount: 1850.00, type: 'income' },
        ]
    };

    // Inicializar la página
    initAccountSummary();
    initTransactionsList();
    initCharts();
    initTransferModal();
    initFilters();

    // Inicializar resumen de cuenta
    function initAccountSummary() {
        document.getElementById('accountName').textContent = accountData.name;
        document.getElementById('accountNumber').textContent = accountData.accountNumber;
        document.getElementById('balanceAmount').textContent = `${accountData.currency}${accountData.balance.toFixed(2)}`;
    }

    // Inicializar lista de transacciones
    function initTransactionsList() {
        const transactionsList = document.getElementById('transactionsList');
        let currentBalance = accountData.balance;
        
        // Limpiar lista
        transactionsList.innerHTML = '';
        
        // Calcular totales para el resumen
        let totalIncome = 0;
        let totalExpense = 0;
        
        // Agregar transacciones
        accountData.transactions.forEach(transaction => {
            // Actualizar totales
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else {
                totalExpense += Math.abs(transaction.amount);
            }
            
            // Calcular balance después de cada transacción
            if (transaction !== accountData.transactions[0]) {
                currentBalance -= transaction.amount;
            }
            
            // Crear elemento de transacción
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            
            // Formatear fecha
            const date = new Date(transaction.date);
            const formattedDate = date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            transactionItem.innerHTML = `
                <div class="transaction-date">${formattedDate}</div>
                <div>
                    <div class="transaction-concept">${transaction.concept}</div>
                    <div class="transaction-category">${transaction.category}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : ''}${accountData.currency}${Math.abs(transaction.amount).toFixed(2)}
                </div>
                <div class="transaction-balance">${accountData.currency}${currentBalance.toFixed(2)}</div>
            `;
            
            transactionsList.appendChild(transactionItem);
        });
        
        // Actualizar resumen de transacciones
        document.getElementById('totalIncome').textContent = `${accountData.currency}${totalIncome.toFixed(2)}`;
        document.getElementById('totalExpense').textContent = `${accountData.currency}${totalExpense.toFixed(2)}`;
        document.getElementById('netBalance').textContent = `${accountData.currency}${(totalIncome - totalExpense).toFixed(2)}`;
        
        // Actualizar información de paginación
        document.getElementById('paginationInfo').textContent = `Mostrando 1-${accountData.transactions.length} de ${accountData.transactions.length} transacciones`;
    }

    // Inicializar gráficos
    function initCharts() {
        // Preparar datos para gráficos
        const categories = {};
        const monthlyData = {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            incomes: [1200, 1350, 2100, 1750, 2200, 2050],
            expenses: [950, 1100, 1300, 1150, 1400, 1350]
        };
        
        // Calcular totales por categoría
        accountData.transactions.forEach(transaction => {
            if (!categories[transaction.category]) {
                categories[transaction.category] = 0;
            }
            categories[transaction.category] += Math.abs(transaction.amount);
        });
        
        // Crear gráfico de categorías
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: [
                        '#4CAF50', '#2196F3', '#FF9800', '#F44336', 
                        '#9C27B0', '#3F51B5', '#009688', '#FF5722',
                        '#795548', '#607D8B'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Gastos por Categoría'
                    }
                }
            }
        });
        
        // Crear gráfico de ingresos/gastos mensuales
        const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
        new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: monthlyData.labels,
                datasets: [
                    {
                        label: 'Ingresos',
                        data: monthlyData.incomes,
                        backgroundColor: '#4CAF50',
                        borderColor: '#4CAF50',
                        borderWidth: 1
                    },
                    {
                        label: 'Gastos',
                        data: monthlyData.expenses,
                        backgroundColor: '#F44336',
                        borderColor: '#F44336',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return accountData.currency + value;
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Ingresos vs Gastos Mensuales'
                    }
                }
            }
        });
    }

    // Inicializar modal de transferencia
    function initTransferModal() {
        const transferForm = document.getElementById('transferForm');
        const transferResult = document.getElementById('transferResult');
        const transferSuccess = document.getElementById('transferSuccess');
        
        transferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular procesamiento
            transferForm.classList.add('d-none');
            transferResult.classList.remove('d-none');
            
            // Mostrar spinner durante 2 segundos
            setTimeout(function() {
                transferResult.classList.add('d-none');
                transferSuccess.classList.remove('d-none');
                
                // Generar número de referencia aleatorio
                const referenceNumber = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
                document.getElementById('referenceNumber').textContent = referenceNumber;
                
                // Actualizar fecha y hora
                const now = new Date();
                const formattedDate = now.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                const formattedTime = now.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                document.getElementById('transferDate').textContent = `${formattedDate} ${formattedTime}`;
                
                // Obtener datos del formulario
                const recipient = document.getElementById('recipientName').value;
                const amount = document.getElementById('transferAmount').value;
                
                document.getElementById('transferRecipient').textContent = recipient;
                document.getElementById('transferAmountConfirm').textContent = `${accountData.currency}${parseFloat(amount).toFixed(2)}`;
                
            }, 2000);
        });
        
        // Reiniciar modal al cerrarlo
        document.getElementById('transferModal').addEventListener('hidden.bs.modal', function() {
            transferForm.classList.remove('d-none');
            transferResult.classList.add('d-none');
            transferSuccess.classList.add('d-none');
            transferForm.reset();
        });
    }

    // Inicializar filtros
    function initFilters() {
        const filterForm = document.getElementById('filterForm');
        
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aquí iría la lógica de filtrado real
            // Por ahora solo mostramos un mensaje de alerta
            
            alert('Filtros aplicados (simulación)');
        });
        
        // Inicializar fechas con el mes actual
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        document.getElementById('startDate').valueAsDate = firstDay;
        document.getElementById('endDate').valueAsDate = lastDay;
    }

    // Botones de paginación (simulados)
    document.querySelectorAll('.pagination-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                alert('Cambio de página (simulación)');
            }
        });
    });

    // Botones de acción rápida
    document.querySelectorAll('.quick-action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            switch(action) {
                case 'transfer':
                    // Abrir modal de transferencia
                    new bootstrap.Modal(document.getElementById('transferModal')).show();
                    break;
                case 'download':
                    alert('Descarga de extracto iniciada (simulación)');
                    break;
                case 'share':
                    alert('Compartir extracto (simulación)');
                    break;
            }
        });
    });
});