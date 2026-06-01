// Create floating particles
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 10 + 5;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 15;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;

        const hue = Math.random() * 60 + 160;
        particle.style.background = `hsla(${hue}, 100%, 70%, 0.1)`;
        particle.style.boxShadow = `0 0 20px hsla(${hue}, 100%, 70%, 0.3)`;

        container.appendChild(particle);
    }
}

let targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 19);

function updateCountdown() {
    let now = new Date();
    let diff = targetDate - now;

    if (diff <= 0) {
        document.querySelector('.hologram-title').textContent = "We're Live!";
        document.getElementById('message').innerHTML =
            '<i class="fas fa-quote-left" style="color: #00ff9d; margin-right: 10px;"></i>' +
            'The future is here! Welcome to Quantum Launch.' +
            '<i class="fas fa-quote-right" style="color: #00ff9d; margin-left: 10px;"></i>';

        document.querySelectorAll('.time-value').forEach(el => {
            el.textContent = '00';
        });

        document.getElementById('progress-bar').style.width = '100%';
        document.getElementById('progress-text').textContent = '100% Complete';
        return;
    }

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('mins').textContent = mins.toString().padStart(2, '0');
    document.getElementById('secs').textContent = secs.toString().padStart(2, '0');

    document.getElementById('days-back').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours-back').textContent = hours.toString().padStart(2, '0');
    document.getElementById('mins-back').textContent = mins.toString().padStart(2, '0');
    document.getElementById('secs-back').textContent = secs.toString().padStart(2, '0');

    const totalTime = 19 * 24 * 60 * 60 * 1000;
    const timePassed = totalTime - diff;
    const progressPercentage = Math.min(100, (timePassed / totalTime) * 100);

    document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
    document.getElementById('progress-text').textContent = `${Math.round(progressPercentage)}% Complete`;

    const messageElement = document.getElementById('message');
    if (days === 0 && hours < 24) {
        messageElement.innerHTML = '<i class="fas fa-quote-left" style="color: #00ff9d; margin-right: 10px;"></i>Final countdown! Get ready for the launch of the century.<i class="fas fa-quote-right" style="color: #00ff9d; margin-left: 10px;"></i>';
    } else if (days < 3) {
        messageElement.innerHTML = '<i class="fas fa-quote-left" style="color: #00ff9d; margin-right: 10px;"></i>Almost there! The future is just around the corner.<i class="fas fa-quote-right" style="color: #00ff9d; margin-left: 10px;"></i>';
    }
}

document.getElementById('notify-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = this.querySelector('.email-input');
    const button = this.querySelector('.notify-btn');

    if (emailInput.value) {
        const originalText = button.textContent;

        button.textContent = 'Subscribed!';
        button.style.background = 'linear-gradient(90deg, #00ff9d, #00ff9d)';
        emailInput.value = '';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'linear-gradient(90deg, #00f7ff, #00ff9d)';
        }, 3000);
    }
});

document.querySelectorAll('.time-unit').forEach(unit => {
    unit.addEventListener('mouseenter', function () {
        this.querySelector('.time-card').style.transform = 'rotateY(180deg)';
    });

    unit.addEventListener('mouseleave', function () {
        this.querySelector('.time-card').style.transform = 'rotateY(0deg)';
    });
});

createParticles();
setInterval(updateCountdown, 1000);
updateCountdown();

const messages = [
    "We're building something extraordinary that will revolutionize the digital landscape. Stay tuned for the future!",
    "The future is being crafted with cutting-edge technology and innovative design. Prepare to be amazed.",
    "Our team is working tirelessly to bring you the next generation of digital experience. The wait will be worth it.",
    "Innovation is at the core of what we do. What's coming will change everything you know about digital interaction."
];

let messageIndex = 0;
setInterval(() => {
    document.getElementById('message').innerHTML =
        `<i class="fas fa-quote-left" style="color: #00ff9d; margin-right: 10px;"></i>
                ${messages[messageIndex]}
                <i class="fas fa-quote-right" style="color: #00ff9d; margin-left: 10px;"></i>`;

    messageIndex = (messageIndex + 1) % messages.length;
}, 10000);