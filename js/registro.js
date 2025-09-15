document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const formSteps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const registerForm = document.getElementById('registerForm');
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    
    let currentStep = 0;
    
    // Inicializar el formulario
    function initForm() {
        showStep(currentStep);
        
        // Configurar botones de siguiente
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (validateStep(currentStep)) {
                    nextStep();
                }
            });
        });
        
        // Configurar botones de anterior
        prevButtons.forEach(button => {
            button.addEventListener('click', prevStep);
        });
        
        // Configurar envío del formulario
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateStep(currentStep)) {
                submitForm();
            }
        });
        
        // Actualizar resumen al cambiar tipo de cuenta
        const accountOptions = document.querySelectorAll('input[name="accountType"]');
        accountOptions.forEach(option => {
            option.addEventListener('change', updateAccountSummary);
        });
    }
    
    // Mostrar el paso actual
    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.style.display = index === stepIndex ? 'block' : 'none';
        });
        
        // Actualizar indicadores de paso
        updateStepIndicators(stepIndex);
        
        // Si es el último paso, actualizar el resumen
        if (stepIndex === formSteps.length - 1) {
            updateSummary();
        }
    }
    
    // Actualizar los indicadores de paso
    function updateStepIndicators(stepIndex) {
        stepIndicators.forEach((indicator, index) => {
            if (index < stepIndex) {
                indicator.className = 'step completed';
            } else if (index === stepIndex) {
                indicator.className = 'step active';
            } else {
                indicator.className = 'step';
            }
        });
    }
    
    // Ir al siguiente paso
    function nextStep() {
        if (currentStep < formSteps.length - 1) {
            currentStep++;
            showStep(currentStep);
            window.scrollTo(0, 0);
        }
    }
    
    // Ir al paso anterior
    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
            window.scrollTo(0, 0);
        }
    }
    
    // Validar el paso actual
    function validateStep(stepIndex) {
        let isValid = true;
        const currentStepElement = formSteps[stepIndex];
        
        // Validar campos requeridos
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'Este campo es obligatorio');
            } else {
                clearError(field);
            }
        });
        
        // Validaciones específicas por paso
        switch(stepIndex) {
            case 0: // Datos personales
                const dniField = document.getElementById('dni');
                if (dniField.value && !validateDNI(dniField.value)) {
                    isValid = false;
                    showError(dniField, 'DNI/NIE no válido');
                }
                
                const birthDateField = document.getElementById('birthDate');
                if (birthDateField.value && !validateAge(birthDateField.value)) {
                    isValid = false;
                    showError(birthDateField, 'Debes ser mayor de 18 años');
                }
                break;
                
            case 1: // Datos de contacto
                const emailField = document.getElementById('email');
                if (emailField.value && !validateEmail(emailField.value)) {
                    isValid = false;
                    showError(emailField, 'Email no válido');
                }
                
                const phoneField = document.getElementById('phone');
                if (phoneField.value && !validatePhone(phoneField.value)) {
                    isValid = false;
                    showError(phoneField, 'Teléfono no válido');
                }
                break;
                
            case 2: // Tipo de cuenta
                const accountType = document.querySelector('input[name="accountType"]:checked');
                if (!accountType) {
                    isValid = false;
                    showAlert('Por favor, selecciona un tipo de cuenta', 'error');
                }
                
                const termsCheckbox = document.getElementById('termsCheckbox');
                if (!termsCheckbox.checked) {
                    isValid = false;
                    showError(termsCheckbox, 'Debes aceptar los términos y condiciones');
                }
                break;
        }
        
        return isValid;
    }
    
    // Mostrar error en un campo
    function showError(field, message) {
        // Limpiar error previo
        clearError(field);
        
        const formGroup = field.closest('.form-group');
        const errorElement = document.createElement('div');
        errorElement.className = 'invalid-feedback';
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        field.classList.add('is-invalid');
        formGroup.appendChild(errorElement);
    }
    
    // Limpiar error de un campo
    function clearError(field) {
        field.classList.remove('is-invalid');
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Validar DNI/NIE
    function validateDNI(dni) {
        const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
        const nieRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
        
        return dniRegex.test(dni) || nieRegex.test(dni);
    }
    
    // Validar edad (mayor de 18 años)
    function validateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age >= 18;
    }
    
    // Validar email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validar teléfono
    function validatePhone(phone) {
        const phoneRegex = /^[6-9]\d{8}$/;
        return phoneRegex.test(phone);
    }
    
    // Mostrar alerta
    function showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${type} alert-dismissible fade show`;
        alertElement.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alertElement);
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            alertElement.classList.remove('show');
            setTimeout(() => alertElement.remove(), 300);
        }, 5000);
    }
    
    // Actualizar resumen de datos
    function updateSummary() {
        // Datos personales
        document.getElementById('summaryName').textContent = document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value;
        document.getElementById('summaryDNI').textContent = document.getElementById('dni').value;
        document.getElementById('summaryBirthDate').textContent = formatDate(document.getElementById('birthDate').value);
        document.getElementById('summaryNationality').textContent = document.getElementById('nationality').value;
        
        // Datos de contacto
        document.getElementById('summaryEmail').textContent = document.getElementById('email').value;
        document.getElementById('summaryPhone').textContent = document.getElementById('phone').value;
        document.getElementById('summaryAddress').textContent = document.getElementById('address').value;
        document.getElementById('summaryCity').textContent = document.getElementById('city').value;
        document.getElementById('summaryPostalCode').textContent = document.getElementById('postalCode').value;
        
        // Tipo de cuenta
        updateAccountSummary();
    }
    
    // Actualizar resumen de tipo de cuenta
    function updateAccountSummary() {
        const selectedAccount = document.querySelector('input[name="accountType"]:checked');
        if (selectedAccount) {
            const accountLabel = selectedAccount.nextElementSibling.querySelector('h4').textContent;
            document.getElementById('summaryAccountType').textContent = accountLabel;
        }
    }
    
    // Formatear fecha
    function formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Enviar formulario
    function submitForm() {
        // Simulación de envío al servidor
        showAlert('Procesando tu solicitud...', 'info');
        
        // Simulamos una respuesta del servidor después de 2 segundos
        setTimeout(() => {
            // Generar número de cuenta simulado
            const accountNumber = generateAccountNumber();
            document.getElementById('accountNumber').textContent = accountNumber;
            
            // Mostrar modal de éxito
            successModal.show();
            
            // Reiniciar formulario para futuros usos
            registerForm.reset();
            currentStep = 0;
            showStep(currentStep);
        }, 2000);
    }
    
    // Generar número de cuenta simulado
    function generateAccountNumber() {
        const prefix = 'ES';
        const digits = Array.from({length: 22}, () => Math.floor(Math.random() * 10)).join('');
        return `${prefix}${digits}`;
    }
    
    // Iniciar el formulario
    initForm();
});