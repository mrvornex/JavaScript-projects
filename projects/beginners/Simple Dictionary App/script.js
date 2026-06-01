// Get elements
const wordInput = document.getElementById('wordInput');
const searchBtn = document.getElementById('searchBtn');
const resultDiv = document.getElementById('result');

// Search function
async function searchWord() {
    const word = wordInput.value.trim();
    
    if (!word) {
        resultDiv.innerHTML = '<p class="error">Please type a word first</p>';
        return;
    }
    
    // Show loading
    resultDiv.innerHTML = '<p>Loading...</p>';
    
    try {
        // Fetch from dictionary API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) {
            throw new Error('Word not found');
        }
        
        const data = await response.json();
        showResult(data[0]);
        
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="error">
                <p>Word not found!</p>
                <p>Try another word</p>
            </div>
        `;
    }
}

// Show result function
function showResult(wordData) {
    const word = wordData.word;
    const meanings = wordData.meanings;
    
    let html = `<div class="word">${word}</div>`;
    
    // Get first meaning and example
    if (meanings.length > 0) {
        const firstMeaning = meanings[0];
        const definition = firstMeaning.definitions[0];
        
        html += `<div class="meaning"><strong>Meaning:</strong> ${definition.definition}</div>`;
        
        if (definition.example) {
            html += `<div class="example"><strong>Example:</strong> ${definition.example}</div>`;
        }
        
        // Show part of speech
        html += `<div style="margin-top:10px; color:#3498db;">
                    <strong>Type:</strong> ${firstMeaning.partOfSpeech}
                 </div>`;
    }
    
    resultDiv.innerHTML = html;
}

// Event listeners
searchBtn.addEventListener('click', searchWord);

wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWord();
    }
});

// Search for "hello" on page load
window.addEventListener('load', () => {
    wordInput.value = 'hello';
    searchWord();
});