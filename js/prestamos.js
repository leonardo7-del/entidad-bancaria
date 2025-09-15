document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const loanForm = document.getElementById('loanForm');
    const loanTypeSelect = document.getElementById('loanType');
    const loanAmountRange = document.getElementById('loanAmountRange');
    const loanAmount = document.getElementById('loanAmount');
    const loanTermRange = document.getElementById('loanTermRange');
    const loanTerm = document.getElementById('loanTerm');
    const interestRate = document.getElementById('interestRate');
    const monthlyPaymentElement = document.getElementById('monthlyPayment');
    const totalInterestElement = document.getElementById('totalInterest');
    const totalPaymentElement = document.getElementById('totalPayment');
    const amortizationTable = document.getElementById('amortizationTable').querySelector('tbody');
    const downloadPdfButton = document.getElementById('downloadPdf');
    const faqItems = document.querySelectorAll('.faq-item');
    
    let loanChart = null;
    
    // Inicializar la página
    function init() {
        // Sincronizar inputs de rango con inputs numéricos
        syncRangeInputs();
        
        // Configurar eventos
        loanForm.addEventListener('submit', calculateLoan);
        loanTypeSelect.addEventListener('change', updateLoanParameters);
        downloadPdfButton.addEventListener('click', generatePDF);
        
        // Configurar FAQs
        setupFAQs();
        
        // Actualizar parámetros iniciales
        updateLoanParameters();
    }
    
    // Sincronizar inputs de rango con inputs numéricos
    function syncRangeInputs() {
        // Sincronizar cantidad del préstamo
        loanAmountRange.addEventListener('input', function() {
            loanAmount.value = this.value;
        });
        
        loanAmount.addEventListener('input', function() {
            loanAmountRange.value = this.value;
        });
        
        // Sincronizar plazo del préstamo
        loanTermRange.addEventListener('input', function() {
            loanTerm.value = this.value;
        });
        
        loanTerm.addEventListener('input', function() {
            loanTermRange.value = this.value;
        });
    }
    
    // Actualizar parámetros según el tipo de préstamo
    function updateLoanParameters() {
        const loanType = loanTypeSelect.value;
        
        if (loanType === 'personal') {
            loanAmountRange.min = 1000;
            loanAmountRange.max = 50000;
            loanAmount.min = 1000;
            loanAmount.max = 50000;
            loanAmount.value = 10000;
            loanAmountRange.value = 10000;
            
            loanTermRange.max = 8;
            loanTerm.max = 8;
            loanTerm.value = 3;
            loanTermRange.value = 3;
            
            interestRate.value = 7.5;
        } else if (loanType === 'hipotecario') {
            loanAmountRange.min = 50000;
            loanAmountRange.max = 300000;
            loanAmount.min = 50000;
            loanAmount.max = 300000;
            loanAmount.value = 150000;
            loanAmountRange.value = 150000;
            
            loanTermRange.max = 30;
            loanTerm.max = 30;
            loanTerm.value = 20;
            loanTermRange.value = 20;
            
            interestRate.value = 3.5;
        } else if (loanType === 'auto') {
            loanAmountRange.min = 5000;
            loanAmountRange.max = 50000;
            loanAmount.min = 5000;
            loanAmount.max = 50000;
            loanAmount.value = 15000;
            loanAmountRange.value = 15000;
            
            loanTermRange.max = 7;
            loanTerm.max = 7;
            loanTerm.value = 5;
            loanTermRange.value = 5;
            
            interestRate.value = 6.0;
        } else if (loanType === 'educativo') {
            loanAmountRange.min = 3000;
            loanAmountRange.max = 30000;
            loanAmount.min = 3000;
            loanAmount.max = 30000;
            loanAmount.value = 10000;
            loanAmountRange.value = 10000;
            
            loanTermRange.max = 10;
            loanTerm.max = 10;
            loanTerm.value = 4;
            loanTermRange.value = 4;
            
            interestRate.value = 5.0;
        }
    }
    
    // Calcular préstamo
    function calculateLoan(e) {
        e.preventDefault();
        
        const principal = parseFloat(loanAmount.value);
        const years = parseInt(loanTerm.value);
        const rate = parseFloat(interestRate.value) / 100 / 12;
        const numberOfPayments = years * 12;
        
        // Calcular pago mensual
        const x = Math.pow(1 + rate, numberOfPayments);
        const monthlyPayment = (principal * x * rate) / (x - 1);
        
        if (isFinite(monthlyPayment)) {
            // Mostrar resultados
            monthlyPaymentElement.textContent = formatCurrency(monthlyPayment);
            totalPaymentElement.textContent = formatCurrency(monthlyPayment * numberOfPayments);
            totalInterestElement.textContent = formatCurrency((monthlyPayment * numberOfPayments) - principal);
            
            // Generar tabla de amortización
            generateAmortizationTable(principal, rate, monthlyPayment, numberOfPayments);
            
            // Generar gráfico
            generateChart(principal, (monthlyPayment * numberOfPayments) - principal);
            
            // Mostrar resultados con animación
            animateResults();
        } else {
            showAlert('Por favor, verifica los valores ingresados', 'error');
        }
    }
    
    // Generar tabla de amortización
    function generateAmortizationTable(principal, rate, monthlyPayment, numberOfPayments) {
        // Limpiar tabla
        amortizationTable.innerHTML = '';
        
        let balance = principal;
        let totalInterest = 0;
        
        // Mostrar solo los años, no todos los meses para simplificar
        for (let year = 1; year <= numberOfPayments / 12; year++) {
            const yearlyPayment = monthlyPayment * 12;
            let yearlyPrincipal = 0;
            let yearlyInterest = 0;
            
            // Calcular para cada mes del año
            for (let month = 1; month <= 12; month++) {
                if ((year - 1) * 12 + month <= numberOfPayments) {
                    const interestPayment = balance * rate;
                    const principalPayment = monthlyPayment - interestPayment;
                    
                    yearlyInterest += interestPayment;
                    yearlyPrincipal += principalPayment;
                    totalInterest += interestPayment;
                    balance -= principalPayment;
                }
            }
            
            // Crear fila para el año
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${year}</td>
                <td>${formatCurrency(monthlyPayment)}</td>
                <td>${formatCurrency(yearlyPrincipal)}</td>
                <td>${formatCurrency(yearlyInterest)}</td>
                <td>${formatCurrency(Math.max(0, balance))}</td>
            `;
            
            amortizationTable.appendChild(row);
        }
    }
    
    // Generar gráfico
    function generateChart(principal, totalInterest) {
        const ctx = document.getElementById('loanChart').getContext('2d');
        
        // Destruir gráfico anterior si existe
        if (loanChart) {
            loanChart.destroy();
        }
        
        // Crear nuevo gráfico
        loanChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Capital', 'Intereses'],
                datasets: [{
                    data: [principal, totalInterest],
                    backgroundColor: ['#4c8bf5', '#ff6b6b'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Animar resultados
    function animateResults() {
        const resultCards = document.querySelectorAll('.result-card');
        
        resultCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate__animated', 'animate__fadeInUp');
            }, index * 100);
        });
    }
    
    // Generar PDF
    function generatePDF() {
        // Simulación de generación de PDF
        showAlert('Generando PDF de tu simulación...', 'info');
        
        setTimeout(() => {
            showAlert('PDF generado correctamente. Se ha iniciado la descarga.', 'success');
        }, 1500);
    }
    
    // Configurar FAQs
    function setupFAQs() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Cerrar otros items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Alternar estado actual
                item.classList.toggle('active');
            });
        });
    }
    
    // Mostrar alerta
    function showAlert(message, type = 'info') {
        const alertContainer = document.createElement('div');
        alertContainer.className = `alert alert-${type}`;
        alertContainer.textContent = message;
        
        document.querySelector('.simulator-results').prepend(alertContainer);
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            alertContainer.style.opacity = '0';
            setTimeout(() => alertContainer.remove(), 300);
        }, 5000);
    }
    
    // Formatear moneda
    function formatCurrency(value) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }
    
    // Inicializar
    init();
});