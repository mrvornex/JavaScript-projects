 const passwordDisplay = document.getElementById('passwordDisplay');
        const copyBtn = document.getElementById('copyBtn');
        const lengthSlider = document.getElementById('lengthSlider');
        const lengthValue = document.getElementById('lengthValue');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        const generateBtn = document.getElementById('generateBtn');
        const resetBtn = document.getElementById('resetBtn');
        const charTypeOptions = document.querySelectorAll('.char-type-option');
        const patternButtons = document.querySelectorAll('.pattern-btn');
        const notification = document.getElementById('notification');
        const avoidAmbiguous = document.getElementById('avoidAmbiguous');
        const autoRefresh = document.getElementById('autoRefresh');
        const pronounceable = document.getElementById('pronounceable');
        const clearHistory = document.getElementById('clearHistory');
        const historyContainer = document.getElementById('historyContainer');
        const scoreCircle = document.getElementById('scoreCircle');
        const scoreValue = document.getElementById('scoreValue');
        const lengthBadge = document.getElementById('lengthBadge');
        const varietyBadge = document.getElementById('varietyBadge');
        const entropyValue = document.getElementById('entropyValue');
        const crackTime = document.getElementById('crackTime');

        // App State
        let currentPassword = '';
        let passwordHistory = JSON.parse(localStorage.getItem('cypherlockHistory')) || [];
        let activeCharTypes = ['uppercase', 'lowercase', 'numbers', 'symbols'];
        let currentPattern = 'random';
        let autoRefreshInterval = null;
        let securityScore = 0;

        // Character sets
        const charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        // Ambiguous characters to avoid
        const ambiguousChars = 'Il1O0';

        // Initialize the app
        document.addEventListener('DOMContentLoaded', () => {
            updateLengthDisplay();
            renderHistory();
            generatePassword();

            // Set up auto-refresh if enabled from previous session
            if (localStorage.getItem('autoRefresh') === 'true') {
                autoRefresh.checked = true;
                startAutoRefresh();
            }
        });

        // Event Listeners
        lengthSlider.addEventListener('input', updateLengthDisplay);
        lengthSlider.addEventListener('change', generatePassword);

        generateBtn.addEventListener('click', generatePassword);

        resetBtn.addEventListener('click', resetSettings);

        copyBtn.addEventListener('click', copyPassword);

        charTypeOptions.forEach(option => {
            option.addEventListener('click', () => {
                option.classList.toggle('active');
                const type = option.getAttribute('data-type');

                if (option.classList.contains('active')) {
                    if (!activeCharTypes.includes(type)) {
                        activeCharTypes.push(type);
                    }
                } else {
                    const index = activeCharTypes.indexOf(type);
                    if (index > -1) {
                        activeCharTypes.splice(index, 1);
                    }
                }

                // Ensure at least one character type is selected
                if (activeCharTypes.length === 0) {
                    option.classList.add('active');
                    activeCharTypes.push(type);
                    showNotification('At least one character type must be selected', 'warning');
                }

                generatePassword();
            });
        });

        patternButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                patternButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentPattern = btn.getAttribute('data-pattern');
                generatePassword();
            });
        });

        avoidAmbiguous.addEventListener('change', generatePassword);
        pronounceable.addEventListener('change', generatePassword);

        autoRefresh.addEventListener('change', () => {
            if (autoRefresh.checked) {
                startAutoRefresh();
                localStorage.setItem('autoRefresh', 'true');
            } else {
                stopAutoRefresh();
                localStorage.setItem('autoRefresh', 'false');
            }
        });

        clearHistory.addEventListener('click', clearPasswordHistory);

        // Functions
        function updateLengthDisplay() {
            lengthValue.textContent = lengthSlider.value;
        }

        function generatePassword() {
            const length = parseInt(lengthSlider.value);
            let password = '';

            switch (currentPattern) {
                case 'random':
                    password = generateRandomPassword(length);
                    break;
                case 'memorable':
                    password = generateMemorablePassword(length);
                    break;
                case 'pin':
                    password = generatePIN(length);
                    break;
                case 'passphrase':
                    password = generatePassphrase();
                    break;
                default:
                    password = generateRandomPassword(length);
            }

            currentPassword = password;
            passwordDisplay.textContent = password;

            // Analyze password strength
            analyzePassword(password);

            // Add to history
            addToHistory(password);
        }

        function generateRandomPassword(length) {
            let charset = '';

            // Build charset based on selected character types
            activeCharTypes.forEach(type => {
                let chars = charSets[type];

                // Remove ambiguous characters if option is enabled
                if (avoidAmbiguous.checked) {
                    for (let char of ambiguousChars) {
                        chars = chars.replace(char, '');
                    }
                }

                charset += chars;
            });

            // If no charset available (shouldn't happen), use all characters
            if (charset === '') {
                charset = charSets.uppercase + charSets.lowercase + charSets.numbers + charSets.symbols;
            }

            // Generate password
            let password = '';
            const cryptoArray = new Uint32Array(length);
            window.crypto.getRandomValues(cryptoArray);

            for (let i = 0; i < length; i++) {
                const randomIndex = cryptoArray[i] % charset.length;
                password += charset[randomIndex];
            }

            // If pronounceable option is selected, adjust the password
            if (pronounceable.checked && currentPattern === 'random') {
                password = makePronounceable(password);
            }

            return password;
        }

        function generateMemorablePassword(length) {
            // Create a memorable password with alternating consonant-vowel patterns
            const consonants = 'bcdfghjklmnpqrstvwxyz';
            const vowels = 'aeiou';
            const numbers = '0123456789';
            const symbols = '!@#$%^&*';

            let password = '';

            // Start with a consonant
            password += getRandomChar(consonants).toUpperCase();

            // Alternate consonant-vowel pattern
            for (let i = 1; i < length - 2; i++) {
                if (i % 2 === 1) {
                    password += getRandomChar(vowels);
                } else {
                    password += getRandomChar(consonants);
                }
            }

            // Add a number and symbol at the end
            password += getRandomChar(numbers);
            password += getRandomChar(symbols);

            return password;
        }

        function generatePIN(length) {
            // Generate a numeric PIN
            let pin = '';
            const cryptoArray = new Uint32Array(length);
            window.crypto.getRandomValues(cryptoArray);

            for (let i = 0; i < length; i++) {
                pin += cryptoArray[i] % 10;
            }

            return pin;
        }

        function generatePassphrase() {
            // Generate a passphrase using random words
            const wordList = [
                'apple', 'brave', 'cloud', 'dragon', 'eagle', 'falcon', 'globe', 'honey', 'island', 'jigsaw',
                'knight', 'lizard', 'mountain', 'novel', 'ocean', 'puzzle', 'queen', 'river', 'sunset', 'tiger',
                'unicorn', 'vortex', 'whale', 'xenon', 'yellow', 'zenith', 'alpha', 'beta', 'gamma', 'delta'
            ];

            // Select 4-6 random words
            const wordCount = 4 + Math.floor(Math.random() * 3);
            const cryptoArray = new Uint32Array(wordCount);
            window.crypto.getRandomValues(cryptoArray);

            let passphrase = '';
            for (let i = 0; i < wordCount; i++) {
                const wordIndex = cryptoArray[i] % wordList.length;
                const word = wordList[wordIndex];
                passphrase += (i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word);

                if (i < wordCount - 1) {
                    // Add separator (number or symbol)
                    if (Math.random() > 0.5) {
                        passphrase += Math.floor(Math.random() * 10);
                    } else {
                        const symbols = '-_!@';
                        passphrase += symbols[Math.floor(Math.random() * symbols.length)];
                    }
                }
            }

            return passphrase;
        }

        function makePronounceable(password) {
            // Simple algorithm to make password more pronounceable
            // by ensuring no more than 2 consonants/vowels in a row where possible
            const vowels = 'aeiouAEIOU';
            const consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';

            let result = '';
            let consecutiveConsonants = 0;
            let consecutiveVowels = 0;

            for (let i = 0; i < password.length; i++) {
                const char = password[i];
                const isVowel = vowels.includes(char);
                const isConsonant = consonants.includes(char);

                if (isVowel) {
                    consecutiveVowels++;
                    consecutiveConsonants = 0;

                    if (consecutiveVowels > 2) {
                        // Replace with a consonant
                        result += getRandomChar(consonants);
                        consecutiveVowels = 0;
                        consecutiveConsonants = 1;
                    } else {
                        result += char;
                    }
                } else if (isConsonant) {
                    consecutiveConsonants++;
                    consecutiveVowels = 0;

                    if (consecutiveConsonants > 2) {
                        // Replace with a vowel
                        result += getRandomChar(vowels);
                        consecutiveConsonants = 0;
                        consecutiveVowels = 1;
                    } else {
                        result += char;
                    }
                } else {
                    // Not a letter (number or symbol)
                    result += char;
                    consecutiveConsonants = 0;
                    consecutiveVowels = 0;
                }
            }

            return result;
        }

        function getRandomChar(charset) {
            const randomArray = new Uint32Array(1);
            window.crypto.getRandomValues(randomArray);
            return charset[randomArray[0] % charset.length];
        }

        function analyzePassword(password) {
            // Calculate password strength
            let score = 0;
            const length = password.length;

            // Length score (max 40 points)
            score += Math.min(length * 2, 40);

            // Character variety score (max 30 points)
            let varietyScore = 0;
            const hasUpper = /[A-Z]/.test(password);
            const hasLower = /[a-z]/.test(password);
            const hasNumbers = /[0-9]/.test(password);
            const hasSymbols = /[^A-Za-z0-9]/.test(password);

            if (hasUpper) varietyScore += 7.5;
            if (hasLower) varietyScore += 7.5;
            if (hasNumbers) varietyScore += 7.5;
            if (hasSymbols) varietyScore += 7.5;

            score += varietyScore;

            // Entropy calculation
            let charsetSize = 0;
            if (hasUpper) charsetSize += 26;
            if (hasLower) charsetSize += 26;
            if (hasNumbers) charsetSize += 10;
            if (hasSymbols) charsetSize += 32;

            const entropy = charsetSize > 0 ? Math.log2(Math.pow(charsetSize, length)) : 0;

            // Entropy score (max 30 points)
            score += Math.min(entropy / 4, 30);

            // Update security score
            securityScore = Math.round(Math.min(score, 100));
            scoreValue.textContent = securityScore;

            // Update circular progress
            const circumference = 314; // 2 * π * r (r=50)
            const offset = circumference - (securityScore / 100) * circumference;
            scoreCircle.style.strokeDashoffset = offset;

            // Set progress color based on score
            if (securityScore < 40) {
                scoreCircle.style.stroke = 'var(--danger)';
            } else if (securityScore < 70) {
                scoreCircle.style.stroke = 'var(--warning)';
            } else if (securityScore < 90) {
                scoreCircle.style.stroke = 'var(--success)';
            } else {
                scoreCircle.style.stroke = 'var(--cyber-green)';
            }

            // Update strength meter
            const strengthPercent = securityScore;
            strengthFill.style.width = `${strengthPercent}%`;

            // Set strength text and color
            let strengthLevel = '';
            let strengthColor = '';

            if (securityScore < 20) {
                strengthLevel = 'Very Weak';
                strengthColor = 'var(--danger)';
            } else if (securityScore < 40) {
                strengthLevel = 'Weak';
                strengthColor = 'var(--danger)';
            } else if (securityScore < 60) {
                strengthLevel = 'Fair';
                strengthColor = 'var(--warning)';
            } else if (securityScore < 80) {
                strengthLevel = 'Good';
                strengthColor = 'var(--success)';
            } else if (securityScore < 90) {
                strengthLevel = 'Strong';
                strengthColor = 'var(--success)';
            } else {
                strengthLevel = 'Very Strong';
                strengthColor = 'var(--cyber-green)';
            }

            strengthText.textContent = strengthLevel;
            strengthFill.style.background = strengthColor;

            // Update analysis badges
            updateBadge(lengthBadge, length >= 12 ? 'Very Strong' : length >= 8 ? 'Strong' : length >= 6 ? 'Fair' : 'Weak');
            updateBadge(varietyBadge, (hasUpper + hasLower + hasNumbers + hasSymbols) >= 4 ? 'Very Strong' :
                (hasUpper + hasLower + hasNumbers + hasSymbols) >= 3 ? 'Strong' :
                    (hasUpper + hasLower + hasNumbers + hasSymbols) >= 2 ? 'Fair' : 'Weak');

            // Update entropy and crack time
            entropyValue.textContent = Math.round(entropy);

            // Estimate crack time
            const guessesPerSecond = 1e9; // 1 billion guesses per second
            const secondsToCrack = Math.pow(2, entropy) / guessesPerSecond;
            crackTime.textContent = formatCrackTime(secondsToCrack);
        }

        function updateBadge(badge, level) {
            badge.textContent = level;
            badge.className = 'strength-badge ';

            if (level.includes('Very Strong')) {
                badge.classList.add('strength-very-strong');
            } else if (level.includes('Strong')) {
                badge.classList.add('strength-strong');
            } else if (level.includes('Fair')) {
                badge.classList.add('strength-medium');
            } else {
                badge.classList.add('strength-weak');
            }
        }

        function formatCrackTime(seconds) {
            if (seconds < 1) return 'Instant';
            if (seconds < 60) return `${Math.round(seconds)} seconds`;
            if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
            if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
            if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
            if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
            if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
            return `${Math.round(seconds / 31536000000)} centuries`;
        }

        function addToHistory(password) {
            // Don't add duplicate consecutive passwords
            if (passwordHistory.length > 0 && passwordHistory[0].password === password) {
                return;
            }

            const historyItem = {
                password: password,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toLocaleDateString(),
                strength: securityScore,
                length: password.length
            };

            // Add to beginning of history
            passwordHistory.unshift(historyItem);

            // Keep only last 20 items
            if (passwordHistory.length > 20) {
                passwordHistory = passwordHistory.slice(0, 20);
            }

            // Save to localStorage
            localStorage.setItem('cypherlockHistory', JSON.stringify(passwordHistory));

            // Update history display
            renderHistory();
        }

        function renderHistory() {
            if (passwordHistory.length === 0) {
                historyContainer.innerHTML = `
                    <div class="empty-history" style="text-align: center; color: var(--gray); padding: 40px 20px;">
                        <i class="fas fa-history" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                        <p>No passwords generated yet. Generate your first password to see it here.</p>
                    </div>
                `;
                return;
            }

            let historyHTML = '';

            passwordHistory.forEach((item, index) => {
                let strengthClass = 'strength-weak';
                if (item.strength >= 80) strengthClass = 'strength-very-strong';
                else if (item.strength >= 60) strengthClass = 'strength-strong';
                else if (item.strength >= 40) strengthClass = 'strength-medium';

                historyHTML += `
                    <div class="history-item">
                        <div class="history-header">
                            <div class="strength-badge ${strengthClass}">${item.strength}/100</div>
                            <div style="color: var(--gray); font-size: 0.9rem;">${item.date} ${item.timestamp}</div>
                        </div>
                        <div class="history-password">${item.password}</div>
                        <div class="history-details">
                            <div>Length: ${item.length} chars</div>
                            <div class="history-actions">
                                <button class="history-btn" onclick="usePassword('${item.password}')" title="Use this password">
                                    <i class="fas fa-redo"></i>
                                </button>
                                <button class="history-btn" onclick="copyHistoryPassword('${item.password}')" title="Copy password">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });

            historyContainer.innerHTML = historyHTML;
        }

        function usePassword(password) {
            currentPassword = password;
            passwordDisplay.textContent = password;
            analyzePassword(password);
            showNotification('Password loaded from history', 'success');
        }

        function copyHistoryPassword(password) {
            navigator.clipboard.writeText(password).then(() => {
                showNotification('Password copied to clipboard!', 'success');
            });
        }

        function clearPasswordHistory() {
            if (passwordHistory.length === 0) return;

            if (confirm('Are you sure you want to clear all password history?')) {
                passwordHistory = [];
                localStorage.removeItem('cypherlockHistory');
                renderHistory();
                showNotification('Password history cleared', 'warning');
            }
        }

        function copyPassword() {
            if (!currentPassword) return;

            navigator.clipboard.writeText(currentPassword).then(() => {
                // Visual feedback
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';

                showNotification('Password copied to clipboard! Clipboard will clear in 60 seconds.', 'success');

                // Reset button after 2 seconds
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);

                // Clear clipboard after 60 seconds for security
                setTimeout(() => {
                    navigator.clipboard.writeText('').then(() => {
                        console.log('Clipboard cleared for security');
                    });
                }, 60000);
            });
        }

        function resetSettings() {
            // Reset length
            lengthSlider.value = 16;
            updateLengthDisplay();

            // Reset character types
            charTypeOptions.forEach(option => {
                option.classList.add('active');
            });
            activeCharTypes = ['uppercase', 'lowercase', 'numbers', 'symbols'];

            // Reset pattern
            patternButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('.pattern-btn[data-pattern="random"]').classList.add('active');
            currentPattern = 'random';

            // Reset toggles
            avoidAmbiguous.checked = false;
            pronounceable.checked = false;

            // Stop auto-refresh if active
            if (autoRefresh.checked) {
                autoRefresh.checked = false;
                stopAutoRefresh();
                localStorage.setItem('autoRefresh', 'false');
            }

            // Generate new password with reset settings
            generatePassword();

            showNotification('Settings reset to default', 'success');
        }

        function startAutoRefresh() {
            // Clear any existing interval
            stopAutoRefresh();

            // Generate new password every 30 seconds
            autoRefreshInterval = setInterval(() => {
                generatePassword();
                showNotification('Auto-refresh: New password generated', 'success');
            }, 30000);
        }

        function stopAutoRefresh() {
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
                autoRefreshInterval = null;
            }
        }

        function showNotification(message, type = 'success') {
            const icon = notification.querySelector('i');
            const content = notification.querySelector('.notification-content');

            // Set notification type
            notification.className = 'notification';
            notification.classList.add(`notification-${type}`);
            notification.classList.add('show');

            // Set icon based on type
            switch (type) {
                case 'success':
                    icon.className = 'fas fa-check-circle';
                    break;
                case 'warning':
                    icon.className = 'fas fa-exclamation-triangle';
                    break;
                case 'danger':
                    icon.className = 'fas fa-exclamation-circle';
                    break;
            }

            content.textContent = message;

            // Auto-hide notification
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }

        // Make functions available globally for history buttons
        window.usePassword = usePassword;
        window.copyHistoryPassword = copyHistoryPassword;