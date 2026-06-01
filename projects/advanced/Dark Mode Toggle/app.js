document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const toggleThumb = document.querySelector('.toggle-thumb');
    const toggleModes = document.querySelectorAll('.toggle-modes span');
    const currentMode = document.getElementById('currentMode');
    const batteryIndicator = document.getElementById('batteryIndicator');
    const themeUsage = document.getElementById('themeUsage');
    const energySaved = document.getElementById('energySaved');
    const eyeComfort = document.getElementById('eyeComfort');
    const previewCards = document.querySelectorAll('.preview-card');
    const lightTime = document.getElementById('lightTime');
    const darkTime = document.getElementById('darkTime');
    const batteryThreshold = document.getElementById('batteryThreshold');
    const thresholdValue = document.getElementById('thresholdValue');
    const transitionBtns = document.querySelectorAll('.transition-btn');
    const syncStatus = document.getElementById('syncStatus');
    const syncBtn = document.getElementById('syncBtn');
    const historyTimeline = document.getElementById('historyTimeline');
    const currentThemeInfo = document.getElementById('currentThemeInfo');
    const lastChanged = document.getElementById('lastChanged');
    const resetThemeBtn = document.getElementById('resetTheme');
    const exportThemeBtn = document.getElementById('exportTheme');
    const themeTransition = document.getElementById('themeTransition');
    
    let currentTheme = localStorage.getItem('theme') || 'auto';
    let transitionStyle = localStorage.getItem('transitionStyle') || 'smooth';
    let themeHistory = JSON.parse(localStorage.getItem('themeHistory')) || [];
    let isTransitioning = false;
    
    const themePositions = {
        light: 10,
        dark: 120,
        auto: 230,
        contrast: 340
    };
    
    const themeIcons = [
        'fa-sun',
        'fa-moon',
        'fa-desktop',
        'fa-adjust'
    ];
    
    const themeColors = {
        light: { bg: '#f8f9fa', text: '#212529', primary: '#4361ee' },
        dark: { bg: '#121212', text: '#f8f9fa', primary: '#7b2cbf' },
        contrast: { bg: '#000000', text: '#ffffff', primary: '#ffff00' }
    };
    
    function initTheme() {
        body.setAttribute('data-theme', currentTheme);
        updateTogglePosition();
        updateStats();
        updateThemeInfo();
        loadHistory();
        setupEventListeners();
        checkSystemTheme();
        simulateBattery();
        updateSyncStatus();
        
        if (currentTheme === 'auto') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            updateCurrentModeText(systemPrefersDark ? 'dark' : 'light');
        } else {
            updateCurrentModeText(currentTheme);
        }
    }
    
    function updateTogglePosition() {
        const position = themePositions[currentTheme];
        toggleThumb.style.transform = `translateX(${position}px)`;
        
        toggleThumb.querySelectorAll('i').forEach((icon, index) => {
            icon.style.opacity = index === getThemeIndex(currentTheme) ? '1' : '0';
        });
    }
    
    function getThemeIndex(theme) {
        const themes = ['light', 'dark', 'auto', 'contrast'];
        return themes.indexOf(theme);
    }
    
    function updateCurrentModeText(theme) {
        const modeNames = {
            light: 'Light Mode',
            dark: 'Dark Mode',
            auto: 'System Auto',
            contrast: 'High Contrast'
        };
        currentMode.textContent = modeNames[theme];
    }
    
    function switchTheme(newTheme, skipTransition = false) {
        if (isTransitioning || currentTheme === newTheme) return;
        
        isTransitioning = true;
        currentTheme = newTheme;
        
        if (skipTransition) {
            applyTheme();
            isTransitioning = false;
        } else {
            if (transitionStyle === 'morph') {
                themeTransition.style.opacity = '1';
                setTimeout(() => {
                    applyTheme();
                    setTimeout(() => {
                        themeTransition.style.opacity = '0';
                        isTransitioning = false;
                    }, 500);
                }, 300);
            } else if (transitionStyle === 'smooth') {
                applyTheme();
                isTransitioning = false;
            } else {
                applyTheme();
                isTransitioning = false;
            }
        }
        
        localStorage.setItem('theme', currentTheme);
        updateTogglePosition();
        addToHistory(newTheme);
        updateThemeInfo();
        updateStats();
    }
    
    function applyTheme() {
        body.setAttribute('data-theme', currentTheme);
        updateCurrentModeText(currentTheme);
        
        if (currentTheme === 'auto') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            updateCurrentModeText(systemPrefersDark ? 'dark' : 'light');
        }
    }
    
    function updateStats() {
        const now = new Date();
        const hour = now.getHours();
        let usage = 87;
        let energy = 42;
        let comfort = 94;
        
        if (currentTheme === 'light') {
            usage = 23;
            energy = 18;
            comfort = hour < 18 ? 88 : 65;
        } else if (currentTheme === 'dark') {
            usage = 76;
            energy = 58;
            comfort = hour >= 18 ? 92 : 78;
        } else if (currentTheme === 'contrast') {
            usage = 45;
            energy = 32;
            comfort = 96;
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            usage = systemPrefersDark ? 68 : 32;
            energy = systemPrefersDark ? 51 : 29;
            comfort = hour >= 18 ? 91 : 85;
        }
        
        animateValue(themeUsage, parseInt(themeUsage.textContent), usage, 1000);
        animateValue(energySaved, parseInt(energySaved.textContent), energy, 1000);
        animateValue(eyeComfort, parseInt(eyeComfort.textContent), comfort, 1000);
    }
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + '%';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    function simulateBattery() {
        const batteryLevel = batteryIndicator.querySelector('.battery-level');
        const batteryIcon = batteryIndicator.querySelector('.fa-battery-full');
        const level = Math.floor(Math.random() * 100);
        
        batteryLevel.style.setProperty('--battery-level', `${level}%`);
        
        let iconClass = 'fa-battery-empty';
        if (level > 80) iconClass = 'fa-battery-full';
        else if (level > 60) iconClass = 'fa-battery-three-quarters';
        else if (level > 40) iconClass = 'fa-battery-half';
        else if (level > 20) iconClass = 'fa-battery-quarter';
        
        batteryIcon.className = `fas ${iconClass}`;
        
        if (level < parseInt(batteryThreshold.value) && currentTheme !== 'dark') {
            setTimeout(() => {
                if (confirm(`Battery is low (${level}%). Switch to Dark Mode to save power?`)) {
                    switchTheme('dark');
                }
            }, 1000);
        }
    }
    
    function addToHistory(theme) {
        const now = new Date();
        const historyItem = {
            theme: theme,
            time: now.toISOString(),
            displayTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        themeHistory.unshift(historyItem);
        if (themeHistory.length > 5) {
            themeHistory.pop();
        }
        
        localStorage.setItem('themeHistory', JSON.stringify(themeHistory));
        loadHistory();
        lastChanged.textContent = `Today at ${historyItem.displayTime}`;
    }
    
    function loadHistory() {
        historyTimeline.innerHTML = '';
        
        themeHistory.forEach(item => {
            const div = document.createElement('div');
            div.className = `history-item ${item.theme}`;
            div.innerHTML = `
                <div class="history-theme">${item.theme.charAt(0).toUpperCase() + item.theme.slice(1)} Mode</div>
                <div class="history-time">${item.displayTime}</div>
                <div class="history-date">${new Date(item.time).toLocaleDateString()}</div>
            `;
            historyTimeline.appendChild(div);
        });
    }
    
    function updateThemeInfo() {
        let themeText = '';
        switch(currentTheme) {
            case 'light': themeText = 'Light Mode'; break;
            case 'dark': themeText = 'Dark Mode'; break;
            case 'auto': 
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                themeText = `System Auto (${systemPrefersDark ? 'Dark' : 'Light'})`;
                break;
            case 'contrast': themeText = 'High Contrast Mode'; break;
        }
        currentThemeInfo.textContent = themeText;
    }
    
    function checkSystemTheme() {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        darkModeMediaQuery.addEventListener('change', (e) => {
            if (currentTheme === 'auto') {
                switchTheme('auto', true);
                updateSyncStatus();
            }
        });
        
        const timeModeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        timeModeMediaQuery.addEventListener('change', (e) => {
            if (currentTheme === 'auto') {
                switchTheme('auto', true);
                updateSyncStatus();
            }
        });
    }
    
    function updateSyncStatus() {
        if (currentTheme === 'auto') {
            syncStatus.querySelector('span').textContent = 'Synced with system';
            syncStatus.querySelector('.sync-indicator').style.background = '#06d6a0';
        } else {
            syncStatus.querySelector('span').textContent = 'Manual override';
            syncStatus.querySelector('.sync-indicator').style.background = '#ef476f';
        }
    }
    
    function setupEventListeners() {
        toggleModes.forEach(mode => {
            mode.addEventListener('click', () => {
                switchTheme(mode.dataset.mode);
            });
        });
        
        previewCards.forEach(card => {
            card.addEventListener('click', () => {
                switchTheme(card.dataset.theme);
            });
        });
        
        batteryThreshold.addEventListener('input', function() {
            thresholdValue.textContent = this.value + '%';
        });
        
        transitionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                transitionBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                transitionStyle = this.dataset.transition;
                localStorage.setItem('transitionStyle', transitionStyle);
            });
        });
        
        syncBtn.addEventListener('click', function() {
            switchTheme('auto');
            updateSyncStatus();
            
            this.innerHTML = '<i class="fas fa-check"></i> Synced';
            this.style.background = '#06d6a0';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-sync"></i> Force Sync';
                this.style.background = '';
            }, 2000);
        });
        
        resetThemeBtn.addEventListener('click', function() {
            if (confirm('Reset all theme settings to default?')) {
                localStorage.removeItem('theme');
                localStorage.removeItem('themeHistory');
                localStorage.removeItem('transitionStyle');
                currentTheme = 'auto';
                themeHistory = [];
                transitionStyle = 'smooth';
                initTheme();
                
                this.innerHTML = '<i class="fas fa-check"></i> Reset Complete';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-undo"></i> Reset to Default';
                }, 2000);
            }
        });
        
        exportThemeBtn.addEventListener('click', function() {
            const settings = {
                theme: currentTheme,
                transitionStyle: transitionStyle,
                batteryThreshold: batteryThreshold.value,
                schedule: {
                    lightTime: lightTime.value,
                    darkTime: darkTime.value
                },
                history: themeHistory
            };
            
            const dataStr = JSON.stringify(settings, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `theme-settings-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.innerHTML = '<i class="fas fa-check"></i> Exported';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-download"></i> Export Settings';
            }, 2000);
        });
        
        setInterval(simulateBattery, 30000);
        
        setInterval(() => {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            if (currentTheme === 'auto') return;
            
            if (lightTime.value && currentTime === lightTime.value) {
                switchTheme('light');
            }
            
            if (darkTime.value && currentTime === darkTime.value) {
                switchTheme('dark');
            }
        }, 60000);
    }
    
    initTheme();
    
    setInterval(updateStats, 30000);
});