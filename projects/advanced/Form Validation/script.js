document.addEventListener('DOMContentLoaded', () => {
    const scanner = new FormScanner();
    const logger = new TerminalLogger('terminal-log');
    
    scanner.initialize('quantum-form');
    
    createParticles();
    
    document.getElementById('scan-btn').addEventListener('click', () => {
        logger.log('Initiating quantum scan...', 'system');
        
        setTimeout(() => {
            const isValid = scanner.scanForm();
            
            if (isValid) {
                logger.log('Quantum scan complete: ALL SYSTEMS NOMINAL', 'success');
                logger.log('Form ready for quantum sync', 'success');
            } else {
                logger.log('Quantum scan complete: ERRORS DETECTED', 'error');
                logger.log('Please correct the highlighted fields', 'warning');
            }
        }, 1000);
    });
    
    document.getElementById('submit-btn').addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!scanner.scanForm()) {
            logger.log('QUANTUM SYNC FAILED: Validation errors detected', 'error');
            logger.log('Cannot initiate sync with invalid data', 'error');
            return;
        }
        
        logger.log('Initiating quantum sync protocol...', 'system');
        logger.log('Encrypting transmission data...', 'system');
        
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <span>Syncing...</span>
        `;
        submitBtn.disabled = true;
        
        setTimeout(() => {
            logger.log('Quantum encryption complete', 'success');
            logger.log('Establishing secure connection...', 'system');
        }, 1500);
        
        setTimeout(() => {
            logger.log('Connection established with Nexus Core', 'success');
            logger.log('Transmitting data packets...', 'system');
        }, 3000);
        
        setTimeout(() => {
            logger.log('Data transmission successful', 'success');
            logger.log('Quantum profile created successfully!', 'success');
            
            submitBtn.innerHTML = `
                <i class="fas fa-check"></i>
                <span>Sync Complete!</span>
            `;
            
            createCelebrationEffect();
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                scanner.resetForm();
                logger.log('System reset for new profile creation', 'system');
            }, 3000);
        }, 4500);
    });
    
    document.getElementById('reset-btn').addEventListener('click', () => {
        logger.log('Initiating data purge protocol...', 'system');
        
        scanner.resetForm();
        logger.log('All fields cleared successfully', 'success');
        logger.log('System ready for new input', 'system');
    });
    
    document.getElementById('clear-log').addEventListener('click', () => {
        logger.clear();
    });
    
    const inputs = document.querySelectorAll('.input-wrapper input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const glow = this.parentElement.querySelector('.input-glow');
            if (glow) {
                glow.style.left = '100%';
                setTimeout(() => {
                    glow.style.left = '-100%';
                }, 500);
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                const scanner = this.parentElement.querySelector('.input-scanner');
                if (scanner) {
                    scanner.style.animation = 'scan 1.5s linear';
                    setTimeout(() => {
                        scanner.style.animation = 'scan 3s linear infinite';
                    }, 1500);
                }
            }
        });
    });
    
    function createParticles() {
        const container = document.getElementById('particles');
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = `radial-gradient(circle, 
                rgba(${Math.floor(Math.random() * 100 + 155)}, 
                ${Math.floor(Math.random() * 100 + 155)}, 
                255, 0.8), 
                transparent)`;
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px rgba(0, 247, 255, 0.5)`;
            
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.animation = `
                float ${duration}s infinite ${delay}s linear
            `;
            
            container.appendChild(particle);
        }
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    function createCelebrationEffect() {
        const colors = ['#00f7ff', '#ff00ff', '#00ff9d', '#ffaa00', '#0077ff'];
        
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.opacity = '0.9';
            confetti.style.zIndex = '9999';
            confetti.style.boxShadow = `0 0 10px ${confetti.style.background}`;
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 1000,
                easing: 'cubic-bezier(0.1, 0.8, 0.9, 0.1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }
});