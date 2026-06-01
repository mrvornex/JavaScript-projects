const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "Whoever is happy will make others happy too.", author: "Anne Frank" },
    { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" }
];

function newQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quote').textContent = `"${quotes[randomIndex].text}"`;
    document.getElementById('author').textContent = `- ${quotes[randomIndex].author}`;
}

window.onload = newQuote;