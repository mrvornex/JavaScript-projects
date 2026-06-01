 // Initialize variables
        let minValue = 50;
        let maxValue = 80;
        const minRange = 0;
        const maxRange = 100;
        let activeThumb = null;
        
        // DOM Elements
        const thumbMin = document.getElementById('thumb-min');
        const thumbMax = document.getElementById('thumb-max');
        const sliderFill = document.getElementById('slider-fill');
        const rangeSlider = document.getElementById('range-slider');
        const currentMin = document.getElementById('current-min');
        const currentMax = document.getElementById('current-max');
        const selectedRange = document.getElementById('selected-range');
        const minDisplay = document.getElementById('min-display');
        const maxDisplay = document.getElementById('max-display');
        const rangeDifference = document.getElementById('range-difference');
        const midValue = document.getElementById('mid-value');
        const percentCoverage = document.getElementById('percent-coverage');
        const visualizerBar = document.getElementById('visualizer-bar');
        
        // Initialize slider
        function updateSlider() {
            // Convert values to percentage for positioning
            const minPercent = ((minValue - minRange) / (maxRange - minRange)) * 100;
            const maxPercent = ((maxValue - minRange) / (maxRange - minRange)) * 100;
            
            // Update thumb positions
            thumbMin.style.left = `${minPercent}%`;
            thumbMax.style.left = `${maxPercent}%`;
            
            // Update fill area
            sliderFill.style.left = `${minPercent}%`;
            sliderFill.style.width = `${maxPercent - minPercent}%`;
            
            // Update display values
            currentMin.textContent = minValue;
            currentMax.textContent = maxValue;
            selectedRange.textContent = `${minValue} - ${maxValue}`;
            minDisplay.textContent = minValue;
            maxDisplay.textContent = maxValue;
            
            // Update stats
            const diff = maxValue - minValue;
            const mid = Math.round((minValue + maxValue) / 2);
            const coverage = Math.round((diff / (maxRange - minRange)) * 100);
            
            rangeDifference.textContent = diff;
            midValue.textContent = mid;
            percentCoverage.textContent = `${coverage}%`;
            
            // Update visualizer
            visualizerBar.style.height = `${coverage}%`;
            
            // Add pulse animation to values
            currentMin.classList.add('value-change');
            currentMax.classList.add('value-change');
            setTimeout(() => {
                currentMin.classList.remove('value-change');
                currentMax.classList.remove('value-change');
            }, 300);
        }
        
        // Calculate value from position
        function getValueFromPosition(positionX) {
            const sliderRect = rangeSlider.getBoundingClientRect();
            const sliderWidth = sliderRect.width;
            const offsetX = positionX - sliderRect.left;
            let percentage = (offsetX / sliderWidth) * 100;
            
            // Clamp between 0 and 100
            percentage = Math.max(0, Math.min(100, percentage));
            
            // Convert to value in range
            return Math.round(minRange + (percentage / 100) * (maxRange - minRange));
        }
        
        // Handle thumb drag start
        function startDrag(event, thumb) {
            event.preventDefault();
            activeThumb = thumb;
            activeThumb.classList.add('active');
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            
            // For touch devices
            document.addEventListener('touchmove', drag);
            document.addEventListener('touchend', stopDrag);
        }
        
        // Handle thumb drag
        function drag(event) {
            if (!activeThumb) return;
            
            let clientX;
            if (event.type.includes('touch')) {
                clientX = event.touches[0].clientX;
            } else {
                clientX = event.clientX;
            }
            
            const newValue = getValueFromPosition(clientX);
            
            // Update the appropriate value
            if (activeThumb === thumbMin) {
                // Ensure min doesn't go below minRange or above maxValue - 1
                minValue = Math.max(minRange, Math.min(maxValue - 1, newValue));
            } else {
                // Ensure max doesn't go above maxRange or below minValue + 1
                maxValue = Math.min(maxRange, Math.max(minValue + 1, newValue));
            }
            
            updateSlider();
        }
        
        // Stop dragging
        function stopDrag() {
            if (activeThumb) {
                activeThumb.classList.remove('active');
                activeThumb = null;
            }
            
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', stopDrag);
        }
        
        // Set preset range
        function setPresetRange(min, max) {
            minValue = min;
            maxValue = max;
            updateSlider();
            
            // Add a visual confirmation
            const presetEvent = new CustomEvent('presetApplied', { detail: { min, max } });
            document.dispatchEvent(presetEvent);
        }
        
        // Set random range
        function setRandomRange() {
            const range1 = Math.floor(Math.random() * 100);
            const range2 = Math.floor(Math.random() * 100);
            
            minValue = Math.min(range1, range2);
            maxValue = Math.max(range1, range2);
            
            // Ensure there's at least a 5 unit difference
            if (maxValue - minValue < 5) {
                maxValue = Math.min(100, minValue + 5);
            }
            
            updateSlider();
            
            // Add a visual effect
            document.body.style.backgroundColor = '#0a0e17';
            setTimeout(() => {
                document.body.style.backgroundColor = '#0a0e17';
            }, 100);
        }
        
        // Reset to default
        function resetToDefault() {
            minValue = 50;
            maxValue = 80;
            updateSlider();
            
            // Visual feedback
            thumbMin.style.transform = 'translate(-50%, -50%) scale(1.5)';
            thumbMax.style.transform = 'translate(-50%, -50%) scale(1.5)';
            
            setTimeout(() => {
                thumbMin.style.transform = 'translate(-50%, -50%)';
                thumbMax.style.transform = 'translate(-50%, -50%)';
            }, 300);
        }
        
        // Initialize event listeners
        function initEventListeners() {
            // Mouse events for min thumb
            thumbMin.addEventListener('mousedown', (e) => startDrag(e, thumbMin));
            thumbMax.addEventListener('mousedown', (e) => startDrag(e, thumbMax));
            
            // Touch events for mobile
            thumbMin.addEventListener('touchstart', (e) => startDrag(e, thumbMin));
            thumbMax.addEventListener('touchstart', (e) => startDrag(e, thumbMax));
            
            // Preset buttons
            document.getElementById('preset-low').addEventListener('click', () => setPresetRange(0, 30));
            document.getElementById('preset-high').addEventListener('click', () => setPresetRange(70, 100));
            document.getElementById('random-btn').addEventListener('click', setRandomRange);
            document.getElementById('reset-btn').addEventListener('click', resetToDefault);
            
            // Click on track to move closest thumb
            rangeSlider.addEventListener('click', (e) => {
                if (activeThumb) return; // Don't interfere with dragging
                
                const clickX = e.clientX || e.touches[0].clientX;
                const newValue = getValueFromPosition(clickX);
                
                // Determine which thumb is closer
                const distanceToMin = Math.abs(newValue - minValue);
                const distanceToMax = Math.abs(newValue - maxValue);
                
                if (distanceToMin < distanceToMax) {
                    // Move min thumb
                    minValue = Math.max(minRange, Math.min(maxValue - 1, newValue));
                } else {
                    // Move max thumb
                    maxValue = Math.min(maxRange, Math.max(minValue + 1, newValue));
                }
                
                updateSlider();
            });
            
            // Keyboard controls for accessibility
            document.addEventListener('keydown', (e) => {
                let step = e.shiftKey ? 5 : 1;
                
                switch(e.key) {
                    case 'ArrowLeft':
                        if (e.altKey) {
                            minValue = Math.max(minRange, minValue - step);
                        } else {
                            maxValue = Math.max(minValue + 1, maxValue - step);
                        }
                        updateSlider();
                        break;
                    case 'ArrowRight':
                        if (e.altKey) {
                            maxValue = Math.min(maxRange, maxValue + step);
                        } else {
                            minValue = Math.min(maxValue - 1, minValue + step);
                        }
                        updateSlider();
                        break;
                    case 'Home':
                        setPresetRange(0, 30);
                        break;
                    case 'End':
                        setPresetRange(70, 100);
                        break;
                    case ' ':
                        setRandomRange();
                        break;
                    case 'r':
                    case 'R':
                        if (e.ctrlKey) resetToDefault();
                        break;
                }
            });
        }
        
        // Initialize
        function init() {
            updateSlider();
            initEventListeners();
            
            // Add some dynamic background effects
            createDynamicBackground();
        }
        
        // Create dynamic background effects
        function createDynamicBackground() {
            const container = document.querySelector('.slider-container');
            
            // Add some floating particles
            for (let i = 0; i < 10; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.width = Math.random() * 10 + 5 + 'px';
                particle.style.height = particle.style.width;
                particle.style.borderRadius = '50%';
                particle.style.background = `radial-gradient(circle, 
                    rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.2), 
                    transparent)`;
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.opacity = Math.random() * 0.5 + 0.2;
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '-1';
                
                // Animate the particle
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                
                particle.style.animation = `
                    float ${duration}s infinite ${delay}s linear
                `;
                
                container.appendChild(particle);
            }
            
            // Add CSS for float animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes float {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(90deg); }
                    50% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(180deg); }
                    75% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(270deg); }
                    100% { transform: translate(0, 0) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Initialize on load
        window.addEventListener('DOMContentLoaded', init);