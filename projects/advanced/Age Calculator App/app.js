    class AgeCalculator {
            constructor() {
                this.history = JSON.parse(localStorage.getItem('ageCalcHistory')) || [];
                this.initializeElements();
                this.populateDateSelectors();
                this.setTodayAsTarget();
                this.setupEventListeners();
                this.loadHistory();
            } 
            
            initializeElements() {
                // Birth date selectors
                this.birthDay = document.getElementById('birth-day');
                this.birthMonth = document.getElementById('birth-month');
                this.birthYear = document.getElementById('birth-year');
                
                // Target date selectors
                this.targetDay = document.getElementById('target-day');
                this.targetMonth = document.getElementById('target-month');
                this.targetYear = document.getElementById('target-year');
                
                // Buttons
                this.calculateBtn = document.getElementById('calculate-btn');
                this.todayBtn = document.getElementById('today-btn');
                this.clearBtn = document.getElementById('clear-btn');
                this.randomBtn = document.getElementById('random-btn');
                this.nextBirthdayBtn = document.getElementById('next-birthday-btn');
                this.compareBtn = document.getElementById('compare-btn');
                this.clearHistoryBtn = document.getElementById('clear-history-btn');
                
                // Display elements
                this.yearsElement = document.getElementById('years');
                this.monthsElement = document.getElementById('months');
                this.daysElement = document.getElementById('days');
                this.weeksElement = document.getElementById('weeks');
                this.hoursElement = document.getElementById('hours');
                this.minutesElement = document.getElementById('minutes');
                this.secondsElement = document.getElementById('seconds');
                
                // Comparison elements
                this.dogYearsElement = document.getElementById('dog-years');
                this.catYearsElement = document.getElementById('cat-years');
                this.generationElement = document.getElementById('generation');
                this.zodiacElement = document.getElementById('zodiac');
                
                // History
                this.historyList = document.getElementById('history-list');
            }
            
            populateDateSelectors() {
                // Populate days (1-31)
                for (let i = 1; i <= 31; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    
                    this.birthDay.appendChild(option.cloneNode(true));
                    this.targetDay.appendChild(option);
                }
                
                // Populate months
                const months = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                
                months.forEach((month, index) => {
                    const option = document.createElement('option');
                    option.value = index + 1;
                    option.textContent = month;
                    
                    this.birthMonth.appendChild(option.cloneNode(true));
                    this.targetMonth.appendChild(option);
                });
                
                // Populate years (1900-current year)
                const currentYear = new Date().getFullYear();
                for (let i = currentYear; i >= 1900; i--) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    
                    this.birthYear.appendChild(option.cloneNode(true));
                    this.targetYear.appendChild(option);
                }
            }
            
            setTodayAsTarget() {
                const today = new Date();
                this.targetDay.value = today.getDate();
                this.targetMonth.value = today.getMonth() + 1;
                this.targetYear.value = today.getFullYear();
            }
            
            setupEventListeners() {
                this.calculateBtn.addEventListener('click', () => this.calculateAge());
                this.todayBtn.addEventListener('click', () => this.setTodayAsTarget());
                this.clearBtn.addEventListener('click', () => this.clearAll());
                this.randomBtn.addEventListener('click', () => this.generateRandomDate());
                this.nextBirthdayBtn.addEventListener('click', () => this.calculateNextBirthday());
                this.compareBtn.addEventListener('click', () => this.showComparisonModal());
                this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
                
                // Enter key support
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.calculateAge();
                    }
                    if (e.key === 'Escape') {
                        this.clearAll();
                    }
                });
            }
            
            calculateAge() {
                const birthDate = this.getDateFromSelectors('birth');
                const targetDate = this.getDateFromSelectors('target');
                
                if (!birthDate) {
                    this.showNotification('Please select a valid birth date!', 'error');
                    return;
                }
                
                if (!targetDate) {
                    this.showNotification('Please select a valid target date!', 'error');
                    return;
                }
                
                if (birthDate > targetDate) {
                    this.showNotification('Birth date cannot be after target date!', 'error');
                    return;
                }
                
                const age = this.calculateAgeDifference(birthDate, targetDate);
                this.displayAge(age);
                this.addToHistory(birthDate, targetDate, age);
                this.saveHistory();
            }
            
            getDateFromSelectors(type) {
                const day = document.getElementById(`${type}-day`).value;
                const month = document.getElementById(`${type}-month`).value;
                const year = document.getElementById(`${type}-year`).value;
                
                if (!day || !month || !year) return null;
                
                // Create date (month is 0-indexed in JavaScript)
                const date = new Date(year, month - 1, day);
                
                // Check if date is valid
                if (date.getDate() != day || date.getMonth() + 1 != month || date.getFullYear() != year) {
                    return null;
                }
                
                return date;
            }
            
            calculateAgeDifference(startDate, endDate) {
                let years = endDate.getFullYear() - startDate.getFullYear();
                let months = endDate.getMonth() - startDate.getMonth();
                let days = endDate.getDate() - startDate.getDate();
                
                // Adjust for negative days
                if (days < 0) {
                    months--;
                    // Get days in previous month
                    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
                    days += prevMonth.getDate();
                }
                
                // Adjust for negative months
                if (months < 0) {
                    years--;
                    months += 12;
                }
                
                // Calculate total days
                const timeDiff = endDate.getTime() - startDate.getTime();
                const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
                
                return {
                    years,
                    months,
                    days: days,
                    totalDays,
                    totalWeeks: Math.floor(totalDays / 7),
                    totalHours: totalDays * 24,
                    totalMinutes: totalDays * 24 * 60,
                    totalSeconds: totalDays * 24 * 60 * 60
                };
            }
            
            displayAge(age) {
                this.yearsElement.textContent = age.years;
                this.monthsElement.textContent = age.months;
                this.daysElement.textContent = age.days;
                this.weeksElement.textContent = age.totalWeeks.toLocaleString();
                this.hoursElement.textContent = age.totalHours.toLocaleString();
                this.minutesElement.textContent = age.totalMinutes.toLocaleString();
                this.secondsElement.textContent = age.totalSeconds.toLocaleString();
                
                // Update comparisons
                this.updateComparisons(age.years);
            }
            
            updateComparisons(years) {
                // Dog years (first year = 15, second year = 9, each after = 5)
                let dogYears = 0;
                if (years >= 1) dogYears += 15;
                if (years >= 2) dogYears += 9;
                if (years > 2) dogYears += (years - 2) * 5;
                this.dogYearsElement.textContent = dogYears;
                
                // Cat years (first year = 15, second year = 9, each after = 4)
                let catYears = 0;
                if (years >= 1) catYears += 15;
                if (years >= 2) catYears += 9;
                if (years > 2) catYears += (years - 2) * 4;
                this.catYearsElement.textContent = catYears;
                
                // Generation
                const generation = this.getGeneration(years);
                this.generationElement.textContent = generation;
                
                // Zodiac sign
                const birthMonth = parseInt(this.birthMonth.value);
                const birthDay = parseInt(this.birthDay.value);
                const zodiac = this.getZodiacSign(birthMonth, birthDay);
                this.zodiacElement.textContent = zodiac;
            }
            
            getGeneration(age) {
                const currentYear = new Date().getFullYear();
                const birthYear = currentYear - age;
                
                if (birthYear >= 2013) return 'Gen Alpha';
                if (birthYear >= 1997) return 'Gen Z';
                if (birthYear >= 1981) return 'Millennials';
                if (birthYear >= 1965) return 'Gen X';
                if (birthYear >= 1946) return 'Baby Boomers';
                return 'Silent Gen';
            }
            
            getZodiacSign(month, day) {
                const zodiacDates = [
                    { sign: "Capricorn", start: [1, 1], end: [1, 19] },
                    { sign: "Aquarius", start: [1, 20], end: [2, 18] },
                    { sign: "Pisces", start: [2, 19], end: [3, 20] },
                    { sign: "Aries", start: [3, 21], end: [4, 19] },
                    { sign: "Taurus", start: [4, 20], end: [5, 20] },
                    { sign: "Gemini", start: [5, 21], end: [6, 20] },
                    { sign: "Cancer", start: [6, 21], end: [7, 22] },
                    { sign: "Leo", start: [7, 23], end: [8, 22] },
                    { sign: "Virgo", start: [8, 23], end: [9, 22] },
                    { sign: "Libra", start: [9, 23], end: [10, 22] },
                    { sign: "Scorpio", start: [10, 23], end: [11, 21] },
                    { sign: "Sagittarius", start: [11, 22], end: [12, 21] },
                    { sign: "Capricorn", start: [12, 22], end: [12, 31] }
                ];
                
                for (const zodiac of zodiacDates) {
                    if ((month === zodiac.start[0] && day >= zodiac.start[1]) ||
                        (month === zodiac.end[0] && day <= zodiac.end[1])) {
                        return zodiac.sign;
                    }
                }
                return "Unknown";
            }
            
            clearAll() {
                this.birthDay.value = '';
                this.birthMonth.value = '';
                this.birthYear.value = '';
                this.setTodayAsTarget();
                
                // Reset display
                this.yearsElement.textContent = '--';
                this.monthsElement.textContent = '--';
                this.daysElement.textContent = '--';
                this.weeksElement.textContent = '--';
                this.hoursElement.textContent = '--';
                this.minutesElement.textContent = '--';
                this.secondsElement.textContent = '--';
                this.dogYearsElement.textContent = '--';
                this.catYearsElement.textContent = '--';
                this.generationElement.textContent = '--';
                this.zodiacElement.textContent = '--';
                
                this.showNotification('All fields cleared!', 'info');
            }
            
            generateRandomDate() {
                const startYear = 1900;
                const endYear = new Date().getFullYear();
                const randomYear = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
                const randomMonth = Math.floor(Math.random() * 12) + 1;
                
                // Get days in month
                const daysInMonth = new Date(randomYear, randomMonth, 0).getDate();
                const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
                
                this.birthDay.value = randomDay;
                this.birthMonth.value = randomMonth;
                this.birthYear.value = randomYear;
                
                this.showNotification('Random birth date generated!', 'info');
            }
            
            calculateNextBirthday() {
                const birthDate = this.getDateFromSelectors('birth');
                if (!birthDate) {
                    this.showNotification('Please select a birth date first!', 'error');
                    return;
                }
                
                const today = new Date();
                const currentYear = today.getFullYear();
                
                // Create next birthday date
                let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
                
                // If birthday has already passed this year, use next year
                if (nextBirthday < today) {
                    nextBirthday.setFullYear(currentYear + 1);
                }
                
                // Set as target date
                this.targetDay.value = nextBirthday.getDate();
                this.targetMonth.value = nextBirthday.getMonth() + 1;
                this.targetYear.value = nextBirthday.getFullYear();
                
                this.calculateAge();
                this.showNotification('Next birthday calculated!', 'success');
            }
            
            showComparisonModal() {
                const birthDate = this.getDateFromSelectors('birth');
                if (!birthDate) {
                    this.showNotification('Please select a birth date first!', 'error');
                    return;
                }
                
                const today = new Date();
                const famousPeople = [
                    { name: "Albert Einstein", birth: new Date(1879, 2, 14) },
                    { name: "Marie Curie", birth: new Date(1867, 10, 7) },
                    { name: "Nelson Mandela", birth: new Date(1918, 6, 18) },
                    { name: "Mother Teresa", birth: new Date(1910, 7, 26) },
                    { name: "Martin Luther King", birth: new Date(1929, 0, 15) },
                    { name: "Steve Jobs", birth: new Date(1955, 1, 24) },
                    { name: "Elon Musk", birth: new Date(1971, 5, 28) },
                    { name: "Taylor Swift", birth: new Date(1989, 11, 13) }
                ];
                
                let comparisonText = "Compared to famous people:\n\n";
                famousPeople.forEach(person => {
                    const personAge = this.calculateAgeDifference(person.birth, today);
                    const yourAge = this.calculateAgeDifference(birthDate, today);
                    const difference = yourAge.years - personAge.years;
                    
                    comparisonText += `${person.name} (${personAge.years} years): `;
                    if (difference > 0) {
                        comparisonText += `You are ${difference} years older\n`;
                    } else if (difference < 0) {
                        comparisonText += `You are ${Math.abs(difference)} years younger\n`;
                    } else {
                        comparisonText += `You are the same age!\n`;
                    }
                });
                
                alert(comparisonText);
            }
            
            addToHistory(birthDate, targetDate, age) {
                const historyItem = {
                    id: Date.now(),
                    birthDate: birthDate.toLocaleDateString(),
                    targetDate: targetDate.toLocaleDateString(),
                    age: `${age.years} years, ${age.months} months, ${age.days} days`,
                    timestamp: new Date().toLocaleString()
                };
                
                this.history.unshift(historyItem);
                if (this.history.length > 10) {
                    this.history.pop();
                }
                
                this.loadHistory();
            }
            
            loadHistory() {
                this.historyList.innerHTML = '';
                
                this.history.forEach(item => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.innerHTML = `
                        <div>
                            <strong>${item.age}</strong><br>
                            <small>Born: ${item.birthDate} | To: ${item.targetDate}</small>
                        </div>
                        <div class="history-age">${item.timestamp}</div>
                    `;
                    
                    historyItem.addEventListener('click', () => {
                        this.loadHistoryItem(item);
                    });
                    
                    this.historyList.appendChild(historyItem);
                });
            }
            
            loadHistoryItem(item) {
                // Parse the birth date from history
                const birthParts = item.birthDate.split('/');
                this.birthMonth.value = parseInt(birthParts[0]);
                this.birthDay.value = parseInt(birthParts[1]);
                this.birthYear.value = parseInt(birthParts[2]);
                
                // Parse target date from history
                const targetParts = item.targetDate.split('/');
                this.targetMonth.value = parseInt(targetParts[0]);
                this.targetDay.value = parseInt(targetParts[1]);
                this.targetYear.value = parseInt(targetParts[2]);
                
                this.calculateAge();
                this.showNotification('History item loaded!', 'info');
            }
            
            clearHistory() {
                if (confirm('Are you sure you want to clear all history?')) {
                    this.history = [];
                    localStorage.removeItem('ageCalcHistory');
                    this.loadHistory();
                    this.showNotification('History cleared!', 'info');
                }
            }
            
            saveHistory() {
                localStorage.setItem('ageCalcHistory', JSON.stringify(this.history));
            }
            
            showNotification(message, type = 'success') {
                // Remove existing notifications
                const existingNotifications = document.querySelectorAll('.notification');
                existingNotifications.forEach(notification => notification.remove());
                
                // Create notification
                const notification = document.createElement('div');
                notification.className = 'notification';
                
                // Set icon based on type
                let icon = 'info-circle';
                let bgColor = '#4CAF50';
                
                if (type === 'error') {
                    icon = 'exclamation-triangle';
                    bgColor = '#f44336';
                } else if (type === 'info') {
                    icon = 'info-circle';
                    bgColor = '#2196F3';
                }
                
                notification.style.background = bgColor;
                notification.innerHTML = `
                    <i class="fas fa-${icon}"></i>
                    <span>${message}</span>
                `;
                
                document.body.appendChild(notification);
                
                // Remove after 3 seconds
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 3000);
            }
        }
        
        // Initialize the calculator
        const ageCalculator = new AgeCalculator();