document.getElementById('birthdate').max = new Date().toISOString().split("T")[0];

function calculateAge() {
    const birthdateInput = document.getElementById('birthdate').value;

    if (!birthdateInput) {
        alert("Please select your birth date first!");
        return;
    }

    const birthDate = new Date(birthdateInput);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    document.getElementById('ageDisplay').textContent = `${years} years, ${months} months, ${days} days`;
    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('resultContainer').classList.add('show');
}

function resetCalculator() {
    document.getElementById('birthdate').value = '';
    document.getElementById('resultContainer').classList.remove('show');
}

document.getElementById('calculateBtn').addEventListener('click', calculateAge);
document.getElementById('resetBtn').addEventListener('click', resetCalculator);
document.getElementById('birthdate').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        calculateAge();
    }
});

window.addEventListener('load', function () {
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 20);
    document.getElementById('birthdate').valueAsDate = defaultDate;
});