let display = document.getElementById('display');
let currentInput = '0';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

function appendToDisplay(value) {
    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }

    if (value === '.' && currentInput.includes('.')) {
        return;
    }

    currentInput += value;
    display.textContent = currentInput;
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    display.textContent = currentInput;
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    display.textContent = currentInput;
}

function setOperator(op) {
    if (currentInput === '0') return;

    if (operator !== '' && previousInput !== '') {
        calculate();
    }

    operator = op;
    previousInput = currentInput;
    shouldResetDisplay = true;
}

function calculate() {
    if (operator === '' || previousInput === '') return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                result = 'Error';
            } else {
                result = prev / current;
            }
            break;
        default:
            return;
    }

    if (result !== 'Error') {
        result = Math.round(result * 100000000) / 100000000;
    }

    currentInput = result.toString();
    display.textContent = currentInput;
    operator = '';
    previousInput = '';
    shouldResetDisplay = true;
}

document.addEventListener('keydown', function (event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        event.preventDefault();
        setOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
    } else if (key === 'Backspace') {
        backspace();
    }
});

document.querySelectorAll('.operator').forEach(button => {
    const op = button.textContent;
    if (op === '+') button.onclick = () => setOperator('+');
    if (op === '-') button.onclick = () => setOperator('-');
    if (op === '×') button.onclick = () => setOperator('*');
    if (op === '/') button.onclick = () => setOperator('/');
});