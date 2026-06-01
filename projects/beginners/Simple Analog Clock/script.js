const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.minute-hand');
const secondHand = document.querySelector('.second-hand');
const digitalTime = document.getElementById('digitalTime');

function updateClock() {
    const now = new Date();
    
    // Get time
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Calculate angles
    const hourDeg = (hours % 12) * 30 + minutes * 0.5; // 30 degrees per hour + 0.5 per minute
    const minuteDeg = minutes * 6; // 6 degrees per minute
    const secondDeg = seconds * 6; // 6 degrees per second
    
    // Update hands
    hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
    
    // Update digital time
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    digitalTime.textContent = timeString;
}

// Update clock every second
setInterval(updateClock, 1000);

// Initial update
updateClock();