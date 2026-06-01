   // DOM Elements
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        const resultContainer = document.querySelector('.result-container');
        const errorMessage = document.querySelector('.error-message');
        const loader = document.querySelector('.loader');
        const wordTitle = document.getElementById('word');
        const phonetic = document.getElementById('phonetic');
        const audioBtn = document.getElementById('audio-btn');
        const meaningsContainer = document.querySelector('.meanings-container');
        const recentWordsContainer = document.querySelector('.recent-words');
        
        // Word of the day - update daily
        const wordsOfDay = [
            {word: "Ephemeral", meaning: "Lasting for a very short time; transient; fleeting."},
            {word: "Ubiquitous", meaning: "Present, appearing, or found everywhere."},
            {word: "Serendipity", meaning: "The occurrence of events by chance in a happy or beneficial way."},
            {word: "Eloquent", meaning: "Fluent or persuasive in speaking or writing."},
            {word: "Resilient", meaning: "Able to withstand or recover quickly from difficult conditions."}
        ];
        
        // Sample data for fallback when API is not available
        const sampleData = {
            "dictionary": {
                "word": "dictionary",
                "phonetic": "/ˈdɪkʃəˌnɛri/",
                "phonetics": [
                    {
                        "text": "/ˈdɪkʃəˌnɛri/",
                        "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/dictionary-us.mp3"
                    }
                ],
                "meanings": [
                    {
                        "partOfSpeech": "noun",
                        "definitions": [
                            {
                                "definition": "A book or electronic resource that lists the words of a language (typically in alphabetical order) and gives their meaning, or gives the equivalent words in a different language, often also providing information about pronunciation, origin, and usage.",
                                "example": "I'll look up 'onomatopoeia' in the dictionary."
                            },
                            {
                                "definition": "A reference work that lists words and their definitions, often organized alphabetically.",
                                "example": "The dictionary on my desk is over a thousand pages long."
                            }
                        ],
                        "synonyms": ["lexicon", "wordbook", "vocabulary", "glossary"]
                    }
                ]
            },
            "eloquent": {
                "word": "eloquent",
                "phonetic": "/ˈɛləkwənt/",
                "phonetics": [
                    {
                        "text": "/ˈɛləkwənt/",
                        "audio": ""
                    }
                ],
                "meanings": [
                    {
                        "partOfSpeech": "adjective",
                        "definitions": [
                            {
                                "definition": "Fluent or persuasive in speaking or writing.",
                                "example": "She delivered an eloquent speech that moved the entire audience."
                            },
                            {
                                "definition": "Clearly expressing or indicating something.",
                                "example": "The ruins are an eloquent reminder of the city's former glory."
                            }
                        ],
                        "synonyms": ["articulate", "fluent", "expressive", "persuasive"]
                    }
                ]
            },
            "serendipity": {
                "word": "serendipity",
                "phonetic": "/ˌsɛrənˈdɪpəti/",
                "phonetics": [
                    {
                        "text": "/ˌsɛrənˈdɪpəti/",
                        "audio": ""
                    }
                ],
                "meanings": [
                    {
                        "partOfSpeech": "noun",
                        "definitions": [
                            {
                                "definition": "The occurrence of events by chance in a happy or beneficial way.",
                                "example": "Finding this vintage bookshop was pure serendipity."
                            }
                        ],
                        "synonyms": ["chance", "fortuity", "fortunate accident", "happy chance"]
                    }
                ]
            }
        };
        
        // Recent searches array
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || ['dictionary', 'eloquent', 'serendipity'];
        
        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            // Set random word of the day
            const randomIndex = Math.floor(Math.random() * wordsOfDay.length);
            const wordOfDayElement = document.querySelector('.word-of-day .word');
            const meaningElement = document.querySelector('.word-of-day .meaning');
            wordOfDayElement.textContent = wordsOfDay[randomIndex].word;
            meaningElement.textContent = wordsOfDay[randomIndex].meaning;
            
            // Display recent searches
            updateRecentSearches();
            
            // Add event listeners
            searchBtn.addEventListener('click', searchWord);
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchWord();
                }
            });
            
            // Display initial word (dictionary)
            displayWordData(sampleData.dictionary);
        });
        
        // Function to search for a word
        async function searchWord() {
            const word = searchInput.value.trim().toLowerCase();
            
            if (!word) {
                showError("Please enter a word to search.");
                return;
            }
            
            // Show loader and hide previous results
            loader.style.display = 'block';
            resultContainer.style.display = 'none';
            errorMessage.style.display = 'none';
            
            try {
                // Try to fetch from API
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                
                if (!response.ok) {
                    // If API fails, check sample data
                    if (sampleData[word]) {
                        displayWordData(sampleData[word]);
                        addToRecentSearches(word);
                    } else {
                        showError("Word not found. Please check your spelling or try another word.");
                    }
                } else {
                    const data = await response.json();
                    displayWordData(data[0]);
                    addToRecentSearches(word);
                }
            } catch (error) {
                // If fetch fails, check sample data
                if (sampleData[word]) {
                    displayWordData(sampleData[word]);
                    addToRecentSearches(word);
                } else {
                    showError("Unable to connect to dictionary service. Please try again later.");
                }
            } finally {
                loader.style.display = 'none';
            }
        }
        
        // Function to display word data
        function displayWordData(data) {
            wordTitle.textContent = data.word;
            phonetic.textContent = data.phonetic || data.phonetics?.[0]?.text || "/phonetic not available/";
            
            // Clear previous meanings
            meaningsContainer.innerHTML = '';
            
            // Check if we have meanings data
            if (!data.meanings || data.meanings.length === 0) {
                meaningsContainer.innerHTML = '<p>No definitions found for this word.</p>';
            } else {
                // Display each meaning
                data.meanings.forEach(meaning => {
                    const meaningSection = document.createElement('div');
                    meaningSection.className = 'meaning-section';
                    
                    const partOfSpeech = document.createElement('div');
                    partOfSpeech.className = 'part-of-speech';
                    partOfSpeech.innerHTML = `<i class="fas fa-font"></i> ${meaning.partOfSpeech.charAt(0).toUpperCase() + meaning.partOfSpeech.slice(1)}`;
                    
                    const meaningList = document.createElement('div');
                    meaningList.className = 'meaning-list';
                    
                    meaning.definitions.forEach((def, index) => {
                        if (index >= 3) return; // Show only first 3 definitions
                        
                        const meaningItem = document.createElement('div');
                        meaningItem.className = 'meaning-item';
                        meaningItem.textContent = def.definition;
                        
                        if (def.example) {
                            const example = document.createElement('div');
                            example.className = 'example';
                            example.textContent = `"${def.example}"`;
                            meaningItem.appendChild(example);
                        }
                        
                        meaningList.appendChild(meaningItem);
                    });
                    
                    meaningSection.appendChild(partOfSpeech);
                    meaningSection.appendChild(meaningList);
                    
                    // Add synonyms if available
                    if (meaning.synonyms && meaning.synonyms.length > 0) {
                        const synonyms = document.createElement('div');
                        synonyms.className = 'synonyms';
                        
                        meaning.synonyms.slice(0, 5).forEach(synonym => {
                            const synonymTag = document.createElement('span');
                            synonymTag.className = 'synonym-tag';
                            synonymTag.textContent = synonym;
                            synonyms.appendChild(synonymTag);
                        });
                        
                        meaningSection.appendChild(synonyms);
                    }
                    
                    meaningsContainer.appendChild(meaningSection);
                });
            }
            
            // Set up audio button if audio is available
            const audioUrl = data.phonetics?.[0]?.audio || '';
            if (audioUrl) {
                audioBtn.onclick = () => {
                    const audio = new Audio(audioUrl);
                    audio.play();
                };
                audioBtn.style.display = 'flex';
            } else {
                audioBtn.style.display = 'none';
            }
            
            // Show result container
            resultContainer.style.display = 'block';
        }
        
        // Function to show error message
        function showError(message) {
            errorMessage.innerHTML = `<p><i class="fas fa-exclamation-circle"></i> ${message}</p>`;
            errorMessage.style.display = 'block';
            resultContainer.style.display = 'none';
        }
        
        // Function to add word to recent searches
        function addToRecentSearches(word) {
            // Remove if already exists
            const index = recentSearches.indexOf(word);
            if (index !== -1) {
                recentSearches.splice(index, 1);
            }
            
            // Add to beginning
            recentSearches.unshift(word);
            
            // Keep only last 6 searches
            if (recentSearches.length > 6) {
                recentSearches.pop();
            }
            
            // Save to localStorage
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
            
            // Update UI
            updateRecentSearches();
        }
        
        // Function to update recent searches UI
        function updateRecentSearches() {
            recentWordsContainer.innerHTML = '';
            
            recentSearches.forEach(word => {
                const recentWordElement = document.createElement('div');
                recentWordElement.className = 'recent-word';
                recentWordElement.textContent = word.charAt(0).toUpperCase() + word.slice(1);
                recentWordElement.addEventListener('click', () => {
                    searchInput.value = word;
                    searchWord();
                });
                recentWordsContainer.appendChild(recentWordElement);
            });
        }
        
        // Function to simulate searching from recent word
        function searchRecentWord(word) {
            searchInput.value = word;
            searchWord();
        }