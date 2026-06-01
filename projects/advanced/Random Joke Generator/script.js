const jokeText = document.getElementById('jokeText');
const jokeCategory = document.getElementById('jokeCategory');
const jokeType = document.getElementById('jokeType');
const newJokeBtn = document.getElementById('newJokeBtn');
const copyBtn = document.getElementById('copyBtn');
const speakBtn = document.getElementById('speakBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const favoritesList = document.getElementById('favoritesList');
const jokeCounter = document.getElementById('jokeCounter');

let jokesList = [];
let favorites = JSON.parse(localStorage.getItem('favoriteJokes')) || [];
let counter = parseInt(localStorage.getItem('jokeCounter')) || 0;

const jokeCategories = ['Programming', 'Pun', 'Christmas', 'Spooky'];
const jokeTypes = ['Single', 'Two Part'];

const programmingJokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
    "Why do Java developers wear glasses? Because they don't C#!",
    "I would tell you a joke about UDP, but you might not get it.",
    "There are 10 types of people in the world: those who understand binary and those who don't."
];

const punJokes = [
    "I'm reading a book on anti-gravity. It's impossible to put down!",
    "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
    "Why don't scientists trust atoms? Because they make up everything!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised!",
    "What do you call a fake noodle? An impasta!"
];

const christmasJokes = [
    "What do you call an elf who sings? A wrapper!",
    "Why is Santa so good at karate? Because he has a black belt!",
    "What do you get if you cross a snowman with a vampire? Frostbite!",
    "Why don't Christmas trees like knitting? Because they always drop their needles!",
    "What do you call a snowman with a six-pack? An abdominal snowman!"
];

const spookyJokes = [
    "Why don't skeletons fight each other? They don't have the guts!",
    "What do ghosts use to wash their hair? Shamboo!",
    "Why did the ghost go to the bar? For the boos!",
    "What do you call a scary potato? A scream-tato!",
    "Why don't mummies take vacations? They're afraid to unwind!"
];

const allJokes = [...programmingJokes, ...punJokes, ...christmasJokes, ...spookyJokes];

function getRandomJoke() {
    const randomCategory = jokeCategories[Math.floor(Math.random() * jokeCategories.length)];
    const randomType = jokeTypes[Math.floor(Math.random() * jokeTypes.length)];
    
    let joke = "";
    
    if (randomCategory === 'Programming') {
        joke = programmingJokes[Math.floor(Math.random() * programmingJokes.length)];
    } else if (randomCategory === 'Pun') {
        joke = punJokes[Math.floor(Math.random() * punJokes.length)];
    } else if (randomCategory === 'Christmas') {
        joke = christmasJokes[Math.floor(Math.random() * christmasJokes.length)];
    } else if (randomCategory === 'Spooky') {
        joke = spookyJokes[Math.floor(Math.random() * spookyJokes.length)];
    }
    
    if (randomType === 'Two Part') {
        const setup = joke;
        const punchline = "That's the joke! 😄";
        joke = `${setup} ... ${punchline}`;
    }
    
    jokeText.textContent = joke;
    jokeCategory.textContent = `Category: ${randomCategory}`;
    jokeType.textContent = `Type: ${randomType}`;
    
    counter++;
    jokeCounter.textContent = counter;
    localStorage.setItem('jokeCounter', counter);
    
    updateFavoriteButton();
}

function copyJoke() {
    const joke = jokeText.textContent;
    navigator.clipboard.writeText(joke)
        .then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
}

function speakJoke() {
    const joke = jokeText.textContent;
    const speech = new SpeechSynthesisUtterance(joke);
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
}

function toggleFavorite() {
    const joke = jokeText.textContent;
    const category = jokeCategory.textContent.replace('Category: ', '');
    
    const jokeObj = {
        text: joke,
        category: category,
        date: new Date().toLocaleDateString()
    };
    
    const jokeIndex = favorites.findIndex(fav => fav.text === joke);
    
    if (jokeIndex === -1) {
        favorites.push(jokeObj);
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Favorited';
        favoriteBtn.style.background = 'linear-gradient(45deg, #FF0000, #FF6B6B)';
    } else {
        favorites.splice(jokeIndex, 1);
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i> Favorite';
        favoriteBtn.style.background = 'linear-gradient(45deg, #FF9A9E, #FAD0C4)';
    }
    
    localStorage.setItem('favoriteJokes', JSON.stringify(favorites));
    displayFavorites();
}

function updateFavoriteButton() {
    const joke = jokeText.textContent;
    const isFavorite = favorites.some(fav => fav.text === joke);
    
    if (isFavorite) {
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Favorited';
        favoriteBtn.style.background = 'linear-gradient(45deg, #FF0000, #FF6B6B)';
    } else {
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i> Favorite';
        favoriteBtn.style.background = 'linear-gradient(45deg, #FF9A9E, #FAD0C4)';
    }
}

function displayFavorites() {
    favoritesList.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p style="text-align: center; color: #666;">No favorite jokes yet!</p>';
        return;
    }
    
    favorites.forEach((joke, index) => {
        const jokeElement = document.createElement('div');
        jokeElement.className = 'favorite-joke';
        jokeElement.innerHTML = `
            <div>
                <strong>${joke.category}</strong>
                <p>${joke.text}</p>
                <small>Saved: ${joke.date}</small>
            </div>
            <button class="remove-fav" onclick="removeFavorite(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        favoritesList.appendChild(jokeElement);
    });
}

function removeFavorite(index) {
    favorites.splice(index, 1);
    localStorage.setItem('favoriteJokes', JSON.stringify(favorites));
    displayFavorites();
    updateFavoriteButton();
}

newJokeBtn.addEventListener('click', getRandomJoke);
copyBtn.addEventListener('click', copyJoke);
speakBtn.addEventListener('click', speakJoke);
favoriteBtn.addEventListener('click', toggleFavorite);

jokeCounter.textContent = counter;
getRandomJoke();
displayFavorites();

setInterval(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96C93D', '#FF9A00'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector('.joke-box').style.background = `linear-gradient(135deg, ${randomColor} 0%, ${darkenColor(randomColor, 30)} 100%)`;
}, 5000);

function darkenColor(color, percent) {
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);
    
    r = Math.floor(r * (100 - percent) / 100);
    g = Math.floor(g * (100 - percent) / 100);
    b = Math.floor(b * (100 - percent) / 100);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}