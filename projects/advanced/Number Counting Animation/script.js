// Get DOM elements
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const allCounters = document.querySelectorAll('.number');

// Variables
let animationStarted = false;
let autoAnimationStarted = false;

// Function to animate counting
function animateCounter(counterElement) {
    const target = parseFloat(counterElement.getAttribute('data-target'));
    const suffix = counterElement.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    // Check if already counting
    if (counterElement.classList.contains('counting')) {
        return;
    }
    
    counterElement.classList.add('counting');
    
    function updateCounter() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < duration) {
            // Calculate current value
            const progress = elapsedTime / duration;
            const currentValue = Math.floor(progress * target);
            
            // Update display
            counterElement.textContent = currentValue + suffix;
            
            // Continue animation
            requestAnimationFrame(updateCounter);
        } else {
            // Animation complete
            counterElement.textContent = target + suffix;
            counterElement.classList.remove('counting');
        }
    }
    
    // Start animation
    updateCounter();
}

// Function to start all counters
function startAllCounters() {
    if (animationStarted) return;
    
    animationStarted = true;
    startBtn.disabled = true;
    startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Counting...';
    
    // Animate each counter with a small delay
    allCounters.forEach((counter, index) => {
        // Don't animate auto counters yet
        if (!counter.closest('.auto-box')) {
            setTimeout(() => {
                animateCounter(counter);
            }, index * 300); // Staggered start
        }
    });
    
    // Re-enable button after animation
    setTimeout(() => {
        startBtn.disabled = false;
        startBtn.innerHTML = '<i class="fas fa-check"></i> Counting Complete!';
        
        // Reset button text after 2 seconds
        setTimeout(() => {
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start Animation';
            animationStarted = false;
        }, 2000);
    }, 2500);
}

// Function to reset all counters
function resetAllCounters() {
    allCounters.forEach(counter => {
        counter.textContent = '0';
        counter.classList.remove('counting');
    });
    
    // Reset button states
    startBtn.disabled = false;
    startBtn.innerHTML = '<i class="fas fa-play"></i> Start Animation';
    animationStarted = false;
    autoAnimationStarted = false;
}

// Function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to start auto counters when scrolled into view
function startAutoCounters() {
    const autoCounters = document.querySelectorAll('.auto-box .number');
    
    autoCounters.forEach(counter => {
        if (isInViewport(counter) && !counter.classList.contains('counting') && !autoAnimationStarted) {
            autoAnimationStarted = true;
            setTimeout(() => {
                animateCounter(counter);
            }, 300);
        }
    });
}

// Event Listeners
startBtn.addEventListener('click', startAllCounters);
resetBtn.addEventListener('click', resetAllCounters);

// Scroll event for auto counters
window.addEventListener('scroll', startAutoCounters);

// Initialize - check auto counters on page load
window.addEventListener('load', () => {
    startAutoCounters();
});

// Simple click effect on counter boxes
document.querySelectorAll('.counter-box').forEach(box => {
    box.addEventListener('click', function() {
        const counter = this.querySelector('.number');
        if (!counter.classList.contains('counting')) {
            // Quick animation for single counter
            const originalValue = counter.textContent;
            counter.textContent = '0';
            
            setTimeout(() => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current) + suffix;
                }, 20);
            }, 100);
        }
    });
});