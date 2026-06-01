class QuantumValidator {
    constructor() {
        this.rules = {
            required: value => value.trim() !== '',
            email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            password: value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value),
            phone: value => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, '')),
            date: value => !isNaN(Date.parse(value)),
            min: (value, param) => value.length >= parseInt(param),
            max: (value, param) => value.length <= parseInt(param),
            match: (value, param, formData) => value === formData[param],
            age: (value, param) => {
                const birthDate = new Date(value);
                const age = new Date().getFullYear() - birthDate.getFullYear();
                return age >= parseInt(param);
            }
        };
        
        this.messages = {
            required: 'This field is required',
            email: 'Please enter a valid quantum email',
            password: 'Must contain uppercase, lowercase, number & symbol',
            phone: 'Please enter a valid quantum comms number',
            date: 'Please enter a valid temporal date',
            min: 'Minimum {param} characters required',
            max: 'Maximum {param} characters allowed',
            match: 'Must match the {param} field',
            age: 'Must be at least {param} years old'
        };
    }
    
    parseRules(ruleString) {
        return ruleString.split('|').map(rule => {
            const [name, param] = rule.split(':');
            return { name, param };
        });
    }
    
    validate(field, formData = {}) {
        const rules = this.parseRules(field.dataset.validation);
        const value = field.querySelector('input, select, textarea')?.value || '';
        const checkbox = field.querySelector('input[type="checkbox"]');
        const fieldValue = checkbox ? checkbox.checked : value;
        
        let isValid = true;
        let errors = [];
        
        for (const rule of rules) {
            if (rule.name === 'required' && !fieldValue) {
                isValid = false;
                errors.push(this.messages.required);
                break;
            }
            
            if (fieldValue && this.rules[rule.name]) {
                const validationResult = this.rules[rule.name](fieldValue, rule.param, formData);
                if (!validationResult) {
                    isValid = false;
                    let message = this.messages[rule.name];
                    if (rule.param) {
                        message = message.replace('{param}', rule.param);
                    }
                    errors.push(message);
                }
            }
        }
        
        return { isValid, errors };
    }
    
    validatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        const levels = [
            { text: 'None', color: '#ff5555', width: '0%' },
            { text: 'Weak', color: '#ff5555', width: '20%' },
            { text: 'Fair', color: '#ffaa00', width: '40%' },
            { text: 'Good', color: '#ffff00', width: '60%' },
            { text: 'Strong', color: '#00ff9d', width: '80%' },
            { text: 'Quantum', color: '#00f7ff', width: '100%' }
        ];
        
        return levels[strength];
    }
}

class FormScanner {
    constructor() {
        this.validator = new QuantumValidator();
        this.fields = [];
        this.validCount = 0;
        this.errorsCount = 0;
        this.warningsCount = 0;
        this.totalFields = 0;
    }
    
    initialize(formId) {
        const form = document.getElementById(formId);
        this.fields = Array.from(form.querySelectorAll('[data-validation]'));
        this.totalFields = this.fields.length;
        
        this.fields.forEach(field => {
            const input = field.querySelector('input, select, textarea');
            if (input) {
                input.addEventListener('input', () => this.validateField(field));
                input.addEventListener('blur', () => this.validateField(field));
                
                const clearBtn = field.querySelector('.clear-btn');
                if (clearBtn) {
                    clearBtn.addEventListener('click', () => {
                        input.value = '';
                        this.validateField(field);
                        input.focus();
                    });
                }
                
                const toggleBtn = field.querySelector('.toggle-password');
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', () => {
                        const type = input.getAttribute('type');
                        input.setAttribute('type', type === 'password' ? 'text' : 'password');
                        toggleBtn.innerHTML = type === 'password' ? 
                            '<i class="fas fa-eye-slash"></i>' : 
                            '<i class="fas fa-eye"></i>';
                    });
                }
            }
            
            const checkbox = field.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.addEventListener('change', () => this.validateField(field));
            }
        });
        
        this.updateStats();
    }
    
    getFormData() {
        const data = {};
        this.fields.forEach(field => {
            const input = field.querySelector('input, select, textarea');
            if (input) {
                data[input.name] = input.value;
            }
        });
        return data;
    }
    
    validateField(field) {
        const formData = this.getFormData();
        const result = this.validator.validate(field, formData);
        
        const statusIcon = field.querySelector('.status-icon');
        const messagesContainer = field.querySelector('.validation-messages');
        
        if (result.isValid) {
            statusIcon.style.color = '#00ff9d';
            statusIcon.className = 'fas fa-check-circle status-icon';
            messagesContainer.innerHTML = '';
            
            if (field.id === 'password-group') {
                this.updatePasswordStrength(field);
            }
        } else {
            statusIcon.style.color = '#ff5555';
            statusIcon.className = 'fas fa-times-circle status-icon';
            
            messagesContainer.innerHTML = result.errors.map(error => 
                `<div class="error-message" style="color: #ff5555; font-size: 0.9rem; margin-top: 3px;">
                    <i class="fas fa-exclamation-circle"></i> ${error}
                </div>`
            ).join('');
            
            if (field.id === 'password-group') {
                this.updatePasswordStrength(field);
            }
        }
        
        this.updateStats();
        this.updateProgress();
        this.updateSubmitButton();
        
        return result.isValid;
    }
    
    updatePasswordStrength(field) {
        const passwordInput = field.querySelector('input[type="password"]');
        if (!passwordInput) return;
        
        const strength = this.validator.validatePasswordStrength(passwordInput.value);
        const strengthFill = field.querySelector('.strength-fill');
        const strengthText = field.querySelector('.strength-text span');
        
        if (strengthFill && strengthText) {
            strengthFill.style.width = strength.width;
            strengthFill.style.background = strength.color;
            strengthText.textContent = strength.text;
            strengthText.style.color = strength.color;
        }
    }
    
    updateStats() {
        this.validCount = 0;
        this.errorsCount = 0;
        this.warningsCount = 0;
        
        this.fields.forEach(field => {
            const formData = this.getFormData();
            const result = this.validator.validate(field, formData);
            
            if (result.isValid) {
                this.validCount++;
            } else {
                this.errorsCount += result.errors.length;
            }
        });
        
        document.getElementById('valid-fields').textContent = this.validCount;
        document.getElementById('errors-count').textContent = this.errorsCount;
        document.getElementById('warnings-count').textContent = this.warningsCount;
    }
    
    updateProgress() {
        const percentage = Math.round((this.validCount / this.totalFields) * 100);
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${percentage}% Valid`;
            progressText.style.color = percentage === 100 ? '#00ff9d' : '#8a9ba8';
        }
    }
    
    updateSubmitButton() {
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.disabled = this.validCount !== this.totalFields;
        }
    }
    
    scanForm() {
        let allValid = true;
        
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });
        
        return allValid;
    }
    
    resetForm() {
        this.fields.forEach(field => {
            const input = field.querySelector('input, select, textarea');
            if (input) {
                input.value = '';
            }
            
            const checkbox = field.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = false;
            }
            
            const statusIcon = field.querySelector('.status-icon');
            if (statusIcon) {
                statusIcon.style.color = '#ff5555';
                statusIcon.className = 'fas fa-circle status-icon';
            }
            
            const messagesContainer = field.querySelector('.validation-messages');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
        });
        
        this.updateStats();
        this.updateProgress();
        this.updateSubmitButton();
    }
}

class TerminalLogger {
    constructor(terminalId) {
        this.terminal = document.getElementById(terminalId);
    }
    
    log(message, type = 'system') {
        const time = new Date().toTimeString().split(' ')[0];
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.setAttribute('data-type', type);
        logEntry.innerHTML = `
            <span class="log-time">[${time}]</span>
            <span class="log-message">${message}</span>
        `;
        
        this.terminal.appendChild(logEntry);
        this.terminal.scrollTop = this.terminal.scrollHeight;
        
        if (type === 'error') {
            this.createErrorEffect();
        } else if (type === 'success') {
            this.createSuccessEffect();
        }
    }
    
    clear() {
        this.terminal.innerHTML = '';
        this.log('Terminal cleared', 'system');
    }
    
    createErrorEffect() {
        const errorFlash = document.createElement('div');
        errorFlash.style.position = 'fixed';
        errorFlash.style.top = '0';
        errorFlash.style.left = '0';
        errorFlash.style.width = '100%';
        errorFlash.style.height = '100%';
        errorFlash.style.background = 'rgba(255, 85, 85, 0.1)';
        errorFlash.style.pointerEvents = 'none';
        errorFlash.style.zIndex = '9999';
        errorFlash.style.animation = 'fadeOut 0.5s ease forwards';
        
        document.body.appendChild(errorFlash);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => errorFlash.remove(), 500);
    }
    
    createSuccessEffect() {
        const successFlash = document.createElement('div');
        successFlash.style.position = 'fixed';
        successFlash.style.top = '0';
        successFlash.style.left = '0';
        successFlash.style.width = '100%';
        successFlash.style.height = '100%';
        successFlash.style.background = 'rgba(0, 255, 157, 0.1)';
        successFlash.style.pointerEvents = 'none';
        successFlash.style.zIndex = '9999';
        successFlash.style.animation = 'fadeOut 0.5s ease forwards';
        
        document.body.appendChild(successFlash);
        
        setTimeout(() => successFlash.remove(), 500);
    }
}