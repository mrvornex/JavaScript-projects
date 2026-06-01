 const clockFace = document.getElementById('clockFace');
        const hourHand = document.getElementById('hourHand');
        const minuteHand = document.getElementById('minuteHand');
        const secondHand = document.getElementById('secondHand');
        const digitalTime = document.getElementById('digitalTime');
        const dateDisplay = document.getElementById('dateDisplay');
        const timezoneButtons = document.querySelectorAll('.timezone-btn');
        const worldClocks = document.getElementById('worldClocks');
        const starsContainer = document.getElementById('starsContainer');
        const sunPosition = document.getElementById('sunPosition');
        const moonPosition = document.getElementById('moonPosition');
        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonth = document.getElementById('currentMonth');
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        
        // Settings elements
        const showOrbits = document.getElementById('showOrbits');
        const showPlanets = document.getElementById('showPlanets');
        const smoothHands = document.getElementById('smoothHands');
        const nightMode = document.getElementById('nightMode');
        const romanNumerals = document.getElementById('romanNumerals');
        const tickingSound = document.getElementById('tickingSound');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        
        // Stats elements
        const dayOfYear = document.getElementById('dayOfYear');
        const weekOfYear = document.getElementById('weekOfYear');
        const secondsToday = document.getElementById('secondsToday');
        const timeUntilMidnight = document.getElementById('timeUntilMidnight');
        
        // App State
        let currentTimezone = 'local';
        let currentDate = new Date();
        let displayDate = new Date();
        let audioContext = null;
        let tickSound = null;
        let calendarMonth = new Date().getMonth();
        let calendarYear = new Date().getFullYear();
        
        // Timezone offsets (in hours)
        const timezones = {
            local: { name: 'Local', offset: 0, city: 'Your Location' },
            utc: { name: 'UTC', offset: 0, city: 'UTC' },
            newyork: { name: 'EST', offset: -5, city: 'New York' },
            london: { name: 'GMT', offset: 0, city: 'London' },
            tokyo: { name: 'JST', offset: 9, city: 'Tokyo' },
            sydney: { name: 'AEDT', offset: 11, city: 'Sydney' },
            dubai: { name: 'GST', offset: 4, city: 'Dubai' },
            moscow: { name: 'MSK', offset: 3, city: 'Moscow' },
            beijing: { name: 'CST', offset: 8, city: 'Beijing' },
            delhi: { name: 'IST', offset: 5.5, city: 'Delhi' },
            paris: { name: 'CET', offset: 1, city: 'Paris' },
            losangeles: { name: 'PST', offset: -8, city: 'Los Angeles' }
        };
        
        // Roman numerals mapping
        const romanNumeralsMap = {
            1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
            6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X',
            11: 'XI', 12: 'XII'
        };
        
        // Initialize the app
        document.addEventListener('DOMContentLoaded', () => {
            createStars();
            createClockFace();
            updateClock();
            updateWorldClocks();
            updateCalendar();
            updateStats();
            updateDaylightVisual();
            
            // Start the clock update interval
            setInterval(updateClock, 1000);
            setInterval(updateWorldClocks, 60000); // Update every minute
            setInterval(updateStats, 1000);
            
            // Set up event listeners
            setupEventListeners();
            
            // Initialize audio if supported
            initAudio();
        });
        
        // Create starry background
        function createStars() {
            const starCount = 150;
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                
                // Random position
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                
                // Random size
                const size = Math.random() * 3 + 1;
                
                // Random animation delay
                const delay = Math.random() * 5;
                
                star.style.left = `${x}%`;
                star.style.top = `${y}%`;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.animationDelay = `${delay}s`;
                
                starsContainer.appendChild(star);
            }
        }
        
        // Create clock face with hour marks and numbers
        function createClockFace() {
            // Clear existing marks
            clockFace.innerHTML = '';
            
            // Create hour marks
            for (let i = 0; i < 60; i++) {
                const mark = document.createElement('div');
                mark.classList.add('hour-mark');
                
                // Bold marks for each hour (every 5th minute)
                if (i % 5 === 0) {
                    mark.classList.add('bold');
                }
                
                // Position the mark
                const angle = (i * 6) * (Math.PI / 180); // 6 degrees per minute
                const radius = 190; // Distance from center
                const x = Math.sin(angle) * radius;
                const y = -Math.cos(angle) * radius;
                
                mark.style.transform = `translate(${x}px, ${y}px) rotate(${i * 6}deg)`;
                
                clockFace.appendChild(mark);
            }
            
            // Create hour numbers
            for (let i = 1; i <= 12; i++) {
                const number = document.createElement('div');
                number.classList.add('clock-number');
                
                // Use Roman numerals if setting is enabled
                if (romanNumerals.checked) {
                    number.textContent = romanNumeralsMap[i];
                    number.classList.add('roman');
                } else {
                    number.textContent = i;
                }
                
                // Position the number
                const angle = (i * 30 - 90) * (Math.PI / 180); // 30 degrees per hour, offset by -90°
                const radius = 150; // Distance from center
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                number.style.left = `calc(50% + ${x}px)`;
                number.style.top = `calc(50% + ${y}px)`;
                
                clockFace.appendChild(number);
            }
        }
        
        // Update the clock display
        function updateClock() {
            const now = new Date();
            
            // Adjust for timezone
            let displayTime = new Date(now.getTime());
            if (currentTimezone !== 'local') {
                const offset = timezones[currentTimezone].offset * 60 * 60 * 1000;
                const localOffset = now.getTimezoneOffset() * 60 * 1000;
                displayTime = new Date(now.getTime() + localOffset + offset);
            }
            
            displayDate = displayTime;
            
            // Get time components
            const hours = displayTime.getHours();
            const minutes = displayTime.getMinutes();
            const seconds = displayTime.getSeconds();
            const milliseconds = displayTime.getMilliseconds();
            
            // Calculate hand angles
            const secondAngle = (seconds + milliseconds / 1000) * 6; // 6 degrees per second
            const minuteAngle = (minutes + seconds / 60) * 6; // 6 degrees per minute
            const hourAngle = (hours % 12 + minutes / 60) * 30; // 30 degrees per hour
            
            // Update hand positions
            if (smoothHands.checked) {
                secondHand.style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;
                minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
                hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
            } else {
                // Jump to nearest second (traditional tick)
                secondHand.style.transform = `translateX(-50%) rotate(${Math.floor(secondAngle / 6) * 6}deg)`;
                minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
                hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
            }
            
            // Update digital time display
            const formattedTime = formatTime(hours, minutes, seconds);
            digitalTime.textContent = formattedTime;
            
            // Update date display
            const formattedDate = formatDate(displayTime);
            dateDisplay.textContent = formattedDate;
            
            // Update daylight visual
            updateDaylightVisual();
            
            // Play ticking sound if enabled
            if (tickingSound.checked && seconds % 1 === 0) {
                playTickSound();
            }
            
            // Update planet positions
            updatePlanetPositions(displayTime);
        }
        
        // Format time as HH:MM:SS
        function formatTime(hours, minutes, seconds) {
            const pad = (num) => num.toString().padStart(2, '0');
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
        
        // Format date as Day, Month Date, Year
        function formatDate(date) {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return date.toLocaleDateString('en-US', options);
        }
        
        // Update world clocks display
        function updateWorldClocks() {
            const now = new Date();
            worldClocks.innerHTML = '';
            
            // Show selected timezone cities
            const cities = ['newyork', 'london', 'tokyo', 'sydney', 'dubai', 'paris'];
            
            cities.forEach(cityKey => {
                const timezone = timezones[cityKey];
                const cityTime = new Date(now.getTime() + 
                    (timezone.offset * 60 * 60 * 1000) + 
                    (now.getTimezoneOffset() * 60 * 1000));
                
                const hours = cityTime.getHours().toString().padStart(2, '0');
                const minutes = cityTime.getMinutes().toString().padStart(2, '0');
                
                const clockItem = document.createElement('div');
                clockItem.classList.add('world-clock-item');
                
                clockItem.innerHTML = `
                    <div class="world-clock-city">${timezone.city}</div>
                    <div class="world-clock-time">${hours}:${minutes}</div>
                    <div class="world-clock-date">${timezone.name}</div>
                `;
                
                worldClocks.appendChild(clockItem);
            });
        }
        
        // Update planet positions based on time
        function updatePlanetPositions(date) {
            if (!showPlanets.checked) {
                document.querySelectorAll('.planet').forEach(p => p.style.opacity = '0');
                return;
            }
            
            document.querySelectorAll('.planet').forEach(p => p.style.opacity = '1');
            
            // Calculate planet positions based on time (simulated orbits)
            const seconds = date.getSeconds();
            const minutes = date.getMinutes();
            const hours = date.getHours();
            
            // Each planet has different orbital periods
            const planet1Angle = (hours * 15 + minutes * 0.25) * (Math.PI / 180); // ~24 hour orbit
            const planet2Angle = (minutes * 6 + seconds * 0.1) * (Math.PI / 180); // ~60 minute orbit
            const planet3Angle = (seconds * 6) * (Math.PI / 180); // ~60 second orbit
            
            // Update planet positions
            const planets = document.querySelectorAll('.planet');
            const orbits = document.querySelectorAll('.orbit');
            
            // Show/hide orbits based on setting
            orbits.forEach(orbit => {
                orbit.style.display = showOrbits.checked ? 'block' : 'none';
            });
            
            // Position planet 1 (Earth - slowest)
            const planet1 = planets[0];
            const radius1 = 220; // Orbit radius in pixels
            const x1 = Math.cos(planet1Angle) * radius1;
            const y1 = Math.sin(planet1Angle) * radius1;
            planet1.style.left = `calc(50% + ${x1}px)`;
            planet1.style.top = `calc(50% + ${y1}px)`;
            
            // Position planet 2 (Mars - medium)
            const planet2 = planets[1];
            const radius2 = 280;
            const x2 = Math.cos(planet2Angle) * radius2;
            const y2 = Math.sin(planet2Angle) * radius2;
            planet2.style.left = `calc(50% + ${x2}px)`;
            planet2.style.top = `calc(50% + ${y2}px)`;
            
            // Position planet 3 (Jupiter - fastest)
            const planet3 = planets[2];
            const radius3 = 320;
            const x3 = Math.cos(planet3Angle) * radius3;
            const y3 = Math.sin(planet3Angle) * radius3;
            planet3.style.left = `calc(50% + ${x3}px)`;
            planet3.style.top = `calc(50% + ${y3}px)`;
        }
        
        // Update daylight visualization
        function updateDaylightVisual() {
            const hours = displayDate.getHours();
            const minutes = displayDate.getMinutes();
            const totalMinutes = hours * 60 + minutes;
            
            // Calculate sun position (6:00 to 18:00)
            let sunPercent = 0;
            if (totalMinutes >= 360 && totalMinutes <= 1080) { // 6:00 to 18:00
                sunPercent = (totalMinutes - 360) / 720; // 0 to 1 across daytime
            } else if (totalMinutes < 360) {
                sunPercent = 0; // Before sunrise
            } else {
                sunPercent = 1; // After sunset
            }
            
            // Calculate sun position (left percentage)
            const sunLeft = 25 + (sunPercent * 50); // 25% to 75%
            sunPosition.style.left = `${sunLeft}%`;
            
            // Calculate moon position (opposite of sun)
            const moonLeft = (sunLeft + 50) % 100;
            moonPosition.style.left = `${moonLeft}%`;
            
            // Show/hide moon based on time
            if (hours >= 18 || hours < 6) {
                moonPosition.style.opacity = '1';
                sunPosition.style.opacity = '0.3';
            } else {
                moonPosition.style.opacity = '0';
                sunPosition.style.opacity = '1';
            }
        }
        
        // Update calendar display
        function updateCalendar() {
            // Get first day of month and number of days
            const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
            const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
            const today = new Date();
            
            // Update month/year display
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                               'July', 'August', 'September', 'October', 'November', 'December'];
            currentMonth.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;
            
            // Clear calendar
            calendarGrid.innerHTML = '';
            
            // Add day headers
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            dayNames.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.classList.add('calendar-day');
                dayElement.textContent = day;
                calendarGrid.appendChild(dayElement);
            });
            
            // Add empty cells for days before first day of month
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.classList.add('calendar-date', 'other-month');
                const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();
                emptyDay.textContent = prevMonthDays - firstDay + i + 1;
                calendarGrid.appendChild(emptyDay);
            }
            
            // Add days of current month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.classList.add('calendar-date');
                dayElement.textContent = day;
                
                // Highlight today
                if (day === today.getDate() && 
                    calendarMonth === today.getMonth() && 
                    calendarYear === today.getFullYear()) {
                    dayElement.classList.add('today');
                }
                
                calendarGrid.appendChild(dayElement);
            }
            
            // Add empty cells for remaining days
            const totalCells = 42; // 6 rows * 7 days
            const remainingCells = totalCells - (firstDay + daysInMonth);
            const nextMonthStart = 1;
            
            for (let i = 0; i < remainingCells; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.classList.add('calendar-date', 'other-month');
                emptyDay.textContent = nextMonthStart + i;
                calendarGrid.appendChild(emptyDay);
            }
        }
        
        // Update time statistics
        function updateStats() {
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 0);
            const diff = now - startOfYear;
            const oneDay = 1000 * 60 * 60 * 24;
            const day = Math.floor(diff / oneDay);
            
            dayOfYear.textContent = day;
            
            // Week of year
            const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
            const pastDaysOfYear = (now - firstDayOfYear) / 86400000;
            weekOfYear.textContent = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            
            // Seconds today
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const totalSecondsToday = hours * 3600 + minutes * 60 + seconds;
            secondsToday.textContent = totalSecondsToday.toLocaleString();
            
            // Time until midnight
            const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
            const hoursUntil = Math.floor(msUntilMidnight / (1000 * 60 * 60));
            const minutesUntil = Math.floor((msUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));
            const secondsUntil = Math.floor((msUntilMidnight % (1000 * 60)) / 1000);
            
            timeUntilMidnight.textContent = 
                `${hoursUntil.toString().padStart(2, '0')}:${minutesUntil.toString().padStart(2, '0')}:${secondsUntil.toString().padStart(2, '0')}`;
        }
        
        // Initialize audio for ticking sound
        function initAudio() {
            if (!window.AudioContext && !window.webkitAudioContext) {
                console.log('Web Audio API not supported');
                tickingSound.disabled = true;
                tickingSound.parentElement.style.opacity = '0.5';
                return;
            }
            
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
        }
        
        // Play ticking sound
        function playTickSound() {
            if (!audioContext || !tickingSound.checked) return;
            
            const volume = parseInt(volumeSlider.value) / 100;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1 * volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
        
        // Set up event listeners
        function setupEventListeners() {
            // Timezone buttons
            timezoneButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    timezoneButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentTimezone = btn.getAttribute('data-timezone');
                    updateClock();
                });
            });
            
            // Settings toggles
            showOrbits.addEventListener('change', () => {
                updatePlanetPositions(displayDate);
            });
            
            showPlanets.addEventListener('change', () => {
                updatePlanetPositions(displayDate);
            });
            
            smoothHands.addEventListener('change', () => {
                updateClock();
            });
            
            nightMode.addEventListener('change', () => {
                if (nightMode.checked) {
                    document.body.style.background = 'linear-gradient(135deg, #050811 0%, #020408 100%)';
                } else {
                    document.body.style.background = 'linear-gradient(135deg, var(--darker) 0%, var(--dark) 100%)';
                }
            });
            
            romanNumerals.addEventListener('change', () => {
                createClockFace();
            });
            
            volumeSlider.addEventListener('input', () => {
                volumeValue.textContent = `${volumeSlider.value}%`;
            });
            
            // Calendar navigation
            prevMonthBtn.addEventListener('click', () => {
                calendarMonth--;
                if (calendarMonth < 0) {
                    calendarMonth = 11;
                    calendarYear--;
                }
                updateCalendar();
            });
            
            nextMonthBtn.addEventListener('click', () => {
                calendarMonth++;
                if (calendarMonth > 11) {
                    calendarMonth = 0;
                    calendarYear++;
                }
                updateCalendar();
            });
            
            // Calendar date click
            calendarGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains('calendar-date') && 
                    !e.target.classList.contains('other-month')) {
                    // Remove previous selection
                    document.querySelectorAll('.calendar-date.selected').forEach(el => {
                        el.classList.remove('selected');
                    });
                    
                    // Add selection to clicked date
                    e.target.classList.add('selected');
                }
            });
        }
        
        // Add some sample planetary animation
        function animatePlanets() {
            const planets = document.querySelectorAll('.planet');
            planets.forEach((planet, index) => {
                // Each planet gets a different animation
                const duration = 20 + (index * 10); // Different durations for each planet
                const orbitSize = 200 + (index * 40);
                
                // Create keyframes for orbit
                const keyframes = [
                    { transform: `rotate(0deg) translate(${orbitSize}px) rotate(0deg)` },
                    { transform: `rotate(360deg) translate(${orbitSize}px) rotate(-360deg)` }
                ];
                
                const options = {
                    duration: duration * 1000,
                    iterations: Infinity
                };
                
                planet.animate(keyframes, options);
            });
        }
        
        // Start planet animations after a short delay
        setTimeout(() => {
            if (showPlanets.checked) {
                animatePlanets();
            }
        }, 1000);