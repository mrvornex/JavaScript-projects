function validateForm() {
    let isValid = true;
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
    document.getElementById('message').style.display = 'none';
    
    let name = document.getElementById('name').value.trim();
    if (name.length < 3) {
        document.getElementById('nameError').textContent = 'Name must be at least 3 characters';
        isValid = false;
    }
    
    let email = document.getElementById('email').value.trim();
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Enter a valid email address';
        isValid = false;
    }
    
    let password = document.getElementById('password').value;
    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }
    
    let confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        document.getElementById('confirmError').textContent = 'Passwords do not match';
        isValid = false;
    }
    
    if (isValid) {
        let msg = document.getElementById('message');
        msg.textContent = '✅ Form submitted successfully!';
        msg.className = 'success';
        document.getElementById('myForm').reset();
    }
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validateForm();
    });
});