let [hours, minutes, seconds] = [0, 0, 0];
let timer = null;
let running = false;

function startStop() {
    if (running) {
        clearInterval(timer);
        document.getElementsByTagName("button")[0].innerText = "Start";
    } else {
        timer = setInterval(updateTime, 1000);
        document.getElementsByTagName("button")[0].innerText = "Stop";
    }
    running = !running;
}

function updateTime() {
    seconds++;
    if (seconds === 60) { minutes++; seconds = 0; }
    if (minutes === 60) { hours++; minutes = 0; }
    document.getElementById("display").innerText = 
        `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function reset() {
    clearInterval(timer);
    [hours, minutes, seconds] = [0, 0, 0];
    running = false;
    document.getElementById("display").innerText = "00:00:00";
    document.getElementsByTagName("button")[0].innerText = "Start";
}