let is24Hour = false;

function updateClock() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let ampm = "";
    
    if (!is24Hour) {
        ampm = hours >= 12 ? " PM" : " AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
    }
    
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    
    let timeString = `${hours}:${minutes}:${seconds}${ampm}`;
    document.getElementById('clock').innerHTML = timeString;

    let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let dateString = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    
    if (!document.querySelector('.date')) {
        let dateDiv = document.createElement('div');
        dateDiv.className = 'date';
        dateDiv.id = 'date';
        document.querySelector('.clock-container').appendChild(dateDiv);
    }
    document.getElementById('date').textContent = dateString;
}

function toggleFormat() {
    is24Hour = !is24Hour;
    document.querySelector('button').textContent = is24Hour ? "12 Hour" : "24 Hour";
}

setInterval(updateClock, 1000);

updateClock();