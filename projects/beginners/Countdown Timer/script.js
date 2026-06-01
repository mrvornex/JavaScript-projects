// Set target date (19 days from now)
let targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 19);

function updateCountdown() {
    let now = new Date();
    let diff = targetDate - now;
    
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('mins').textContent = mins.toString().padStart(2, '0');
    document.getElementById('secs').textContent = secs.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();