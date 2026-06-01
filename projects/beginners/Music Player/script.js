const songs = [
    {
        title: "Calm Piano",
        artist: "Relaxation Music",
        src: "https://assets.codepen.io/4358584/Calm.mp3",
        art: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop"
    },
    {
        title: "Rain Sounds",
        artist: "Nature Therapy",
        src: "https://assets.codepen.io/4358584/Rain.mp3",
        art: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=300&h=300&fit=crop"
    },
    {
        title: "Study Focus",
        artist: "Concentration Music",
        src: "https://assets.codepen.io/4358584/Study.mp3",
        art: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
    }
];

let currentSong = 0;
const audio = new Audio(songs[0].src);
const playBtn = document.getElementById("playBtn");

function loadSong(index) {
    currentSong = (index + songs.length) % songs.length;
    audio.src = songs[currentSong].src;
    document.getElementById("songTitle").textContent = songs[currentSong].title;
    document.getElementById("artist").textContent = songs[currentSong].artist;
    document.getElementById("albumArt").src = songs[currentSong].art;
    audio.load();
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸️ Pause";
    } else {
        audio.pause();
        playBtn.textContent = "▶️ Play";
    }
}

function nextSong() {
    loadSong(currentSong + 1);
    audio.play();
    playBtn.textContent = "⏸️ Pause";
}

function prevSong() {
    loadSong(currentSong - 1);
    audio.play();
    playBtn.textContent = "⏸️ Pause";
}

audio.addEventListener("timeupdate", () => {
    const progress = document.getElementById("progress");
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
    }
});

document.getElementById("progress").addEventListener("input", (e) => {
    if (audio.duration) {
        audio.currentTime = (e.target.value / 100) * audio.duration;
    }
});

loadSong(0);

audio.addEventListener("ended", nextSong);