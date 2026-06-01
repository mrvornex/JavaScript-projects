class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = null;
        this.history = [];
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        this.historyList = document.getElementById('history-list');
    }

    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.getAttribute('data-number'));
                this.updateDisplay();
            });
        });

        // Operation buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                this.handleAction(action);
                this.updateDisplay();
            });
        });

        // Clear history button
        document.getElementById('clear-history').addEventListener('click', () => {
            this.clearHistory();
        });

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardInput(event);
        });
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;

        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'plus-minus':
                this.toggleSign();
                break;
            case 'decimal':
                this.appendDecimal();
                break;
            case 'equals':
                this.calculate();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.chooseOperation(action);
                break;
        }
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
    }

    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    toggleSign() {
        if (this.currentOperand === '0') return;

        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
    }

    appendDecimal() {
        if (this.currentOperand.includes('.')) return;
        this.currentOperand += '.';
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0') return;

        if (this.previousOperand !== '') {
            this.calculate();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Add to history
        this.addToHistory(prev, current, this.operation, computation);

        this.currentOperand = computation.toString();
        this.operation = null;
        this.previousOperand = '';
    }

    addToHistory(a, b, operation, result) {
        const operationSymbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };

        const historyItem = {
            calculation: `${a} ${operationSymbols[operation]} ${b}`,
            result: result
        };

        this.history.unshift(historyItem);

        // Keep only last 10 items
        if (this.history.length > 10) {
            this.history.pop();
        }

        this.updateHistoryDisplay();
    }

    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.formatDisplayNumber(this.currentOperand);

        if (this.operation != null) {
            const operationSymbols = {
                'add': '+',
                'subtract': '−',
                'multiply': '×',
                'divide': '÷'
            };
            this.previousOperandElement.textContent =
                `${this.formatDisplayNumber(this.previousOperand)} ${operationSymbols[this.operation]}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    formatDisplayNumber(number) {
        const stringNumber = number.toString();

        if (stringNumber.includes('.')) {
            const [integerPart, decimalPart] = stringNumber.split('.');
            return `${this.formatInteger(integerPart)}.${decimalPart}`;
        }

        return this.formatInteger(stringNumber);
    }

    formatInteger(integerString) {
        // Handle negative numbers
        let sign = '';
        if (integerString.startsWith('-')) {
            sign = '-';
            integerString = integerString.slice(1);
        }

        if (integerString === '') return '0';

        // Add commas for thousands
        return sign + parseInt(integerString).toLocaleString();
    }

    updateHistoryDisplay() {
        this.historyList.innerHTML = '';

        this.history.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                        <div>${item.calculation}</div>
                        <div><strong>= ${this.formatDisplayNumber(item.result.toString())}</strong></div>
                    `;

            li.addEventListener('click', () => {
                this.currentOperand = item.result.toString();
                this.updateDisplay();
            });

            this.historyList.appendChild(li);
        });
    }

    handleKeyboardInput(event) {
        event.preventDefault();

        if (event.key >= '0' && event.key <= '9') {
            this.appendNumber(event.key);
            this.updateDisplay();
        }

        if (event.key === '.') {
            this.appendDecimal();
            this.updateDisplay();
        }

        if (event.key === '+') {
            this.chooseOperation('add');
            this.updateDisplay();
        }

        if (event.key === '-') {
            this.chooseOperation('subtract');
            this.updateDisplay();
        }

        if (event.key === '*') {
            this.chooseOperation('multiply');
            this.updateDisplay();
        }

        if (event.key === '/') {
            event.preventDefault();
            this.chooseOperation('divide');
            this.updateDisplay();
        }

        if (event.key === 'Enter' || event.key === '=') {
            this.calculate();
            this.updateDisplay();
        }

        if (event.key === 'Escape') {
            this.clear();
            this.updateDisplay();
        }

        if (event.key === 'Backspace') {
            this.delete();
            this.updateDisplay();
        }

        if (event.key === '%') {
            this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
            this.updateDisplay();
        }
    }
}

// Initialize calculator
const calculator = new Calculator();