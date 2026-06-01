const fortunes = [
    "A beautiful, smart, and loving person will be coming into your life.",
    "A dubious friend may be an enemy in camouflage.",
    "A faithful friend is a strong defense.",
    "A feather in the hand is better than a bird in the air.",
    "A fresh start will put you on your way.",
    "A friend asks only for your time, not your money.",
    "A friend is a present you give yourself.",
    "A gambler not only will lose what he has, but also will lose what he doesn't have.",
    "A golden egg of opportunity falls into your lap this month.",
    "A good friendship is often more important than a passionate romance.",
    "A good time to finish up old tasks.",
    "A hunch is creativity trying to tell you something.",
    "A lifetime of happiness lies ahead of you.",
    "A light heart carries you through all the hard times.",
    "A new perspective will come with the new year."
];

function openFortune() {
    const cookie = document.getElementById('cookie');
    const fortuneText = document.getElementById('fortuneText');
    const button = document.querySelector('button');
    
    cookie.classList.add('opened');
    button.disabled = true;
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * fortunes.length);
        fortuneText.textContent = `"${fortunes[randomIndex]}"`;
        
        setTimeout(() => {
            cookie.classList.remove('opened');
            button.disabled = false;
        }, 5000);
    }, 1000);
}

document.addEventListener('keypress', (e) => {
    if (e.key === ' ' && !document.querySelector('button').disabled) {
        e.preventDefault();
        openFortune();
    }
});

document.getElementById('cookie').addEventListener('click', openFortune);