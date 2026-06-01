// API Configuration
const API_KEY = 'YOUR_API_KEY_HERE'; // Get from https://openweathermap.org/api
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Weather Icons Mapping
const WEATHER_ICONS = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

// App State
let appState = {
    currentCity: 'London',
    units: 'metric',
    theme: 'light',
    lastUpdate: null,
    currentWeather: null,
    forecast: null,
    airQuality: null,
    chart: null
};

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const useLocationBtn = document.getElementById('useLocation');
const themeSwitch = document.getElementById('themeSwitch');
const weatherIcon = document.getElementById('weatherIcon');
const currentTemp = document.getElementById('currentTemp');
const cityName = document.getElementById('cityName');
const country = document.getElementById('country');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const windSpeed = document.getElementById('windSpeed');
const windDirection = document.getElementById('windDirection');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const cloudiness = document.getElementById('cloudiness');
const uvIndex = document.getElementById('uvIndex');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const currentDate = document.getElementById('currentDate');
const hourlyForecast = document.getElementById('hourlyForecast');
const dailyForecast = document.getElementById('dailyForecast');
const toggleBtns = document.querySelectorAll('.toggle-btn');
const aqiValue = document.getElementById('aqiValue');
const aqiStatus = document.getElementById('aqiStatus');
const aqiDescription = document.getElementById('aqiDescription');
const lastUpdated = document.getElementById('lastUpdated');
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const saveSettingsBtn = document.getElementById('saveSettings');
const modalClose = document.querySelector('.modal-close');
const loadingOverlay = document.getElementById('loadingOverlay');
const refreshBtn = document.getElementById('refreshData');
const unitBtns = document.querySelectorAll('.unit-btn');
const quickCities = document.querySelectorAll('.quick-city');

// Initialize App
function initApp() {
    loadSettings();
    updateDateTime();
    getWeatherData('London');
    setupEventListeners();
    startAutoRefresh();
}

// Load saved settings
function loadSettings() {
    const savedUnits = localStorage.getItem('weatherUnits') || 'metric';
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedCity = localStorage.getItem('lastCity') || 'London';
    
    appState.units = savedUnits;
    appState.theme = savedTheme;
    appState.currentCity = savedCity;
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeSwitch.checked = savedTheme === 'dark';
    
    // Apply units
    document.querySelectorAll('.unit-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.unit === savedUnits) {
            btn.classList.add('active');
        }
    });
    
    // Set input value
    cityInput.value = savedCity;
}

// Save settings
function saveSettings() {
    localStorage.setItem('weatherUnits', appState.units);
    localStorage.setItem('theme', appState.theme);
    localStorage.setItem('lastCity', appState.currentCity);
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', () => searchWeather());
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWeather();
    });
    
    // Location button
    useLocationBtn.addEventListener('click', getLocationWeather);
    
    // Theme toggle
    themeSwitch.addEventListener('change', toggleTheme);
    
    // Forecast toggle
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => toggleForecast(btn.dataset.type));
    });
    
    // Settings modal
    settingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    modalClose.addEventListener('click', () => settingsModal.classList.remove('active'));
    saveSettingsBtn.addEventListener('click', saveUserSettings);
    
    // Unit buttons
    unitBtns.forEach(btn => {
        btn.addEventListener('click', () => changeUnits(btn.dataset.unit));
    });
    
    // Refresh button
    refreshBtn.addEventListener('click', () => getWeatherData(appState.currentCity));
    
    // Quick cities
    quickCities.forEach(city => {
        city.addEventListener('click', () => getWeatherData(city.dataset.city));
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });
}

// Toggle theme
function toggleTheme() {
    appState.theme = themeSwitch.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', appState.theme);
    saveSettings();
}

// Change units
function changeUnits(unit) {
    appState.units = unit;
    unitBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    getWeatherData(appState.currentCity);
    saveSettings();
}

// Toggle forecast view
function toggleForecast(type) {
    toggleBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (type === 'hourly') {
        hourlyForecast.style.display = 'block';
        dailyForecast.style.display = 'none';
    } else {
        hourlyForecast.style.display = 'none';
        dailyForecast.style.display = 'block';
    }
}

// Search weather
function searchWeather() {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
}

// Get weather by user location
function getLocationWeather() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by your browser', 'error');
        return;
    }
    
    showLoading();
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            getWeatherByCoords(latitude, longitude);
        },
        (error) => {
            hideLoading();
            showNotification('Unable to retrieve your location', 'error');
            console.error('Geolocation error:', error);
        }
    );
}

// Get weather data
async function getWeatherData(city) {
    showLoading();
    appState.currentCity = city;
    
    try {
        const [weatherData, forecastData, airQualityData] = await Promise.all([
            fetchWeather(city),
            fetchForecast(city),
            fetchAirQuality(city)
        ]);
        
        appState.currentWeather = weatherData;
        appState.forecast = forecastData;
        appState.airQuality = airQualityData;
        
        updateUI();
        updateForecastUI();
        updateAirQualityUI();
        updateChart();
        
        appState.lastUpdate = new Date();
        updateLastUpdated();
        
        // Save city
        localStorage.setItem('lastCity', city);
        
    } catch (error) {
        showNotification('Failed to fetch weather data', 'error');
        console.error('Error fetching weather data:', error);
    } finally {
        hideLoading();
    }
}

// Get weather by coordinates
async function getWeatherByCoords(lat, lon) {
    try {
        const [weatherData, forecastData, airQualityData] = await Promise.all([
            fetchWeatherByCoords(lat, lon),
            fetchForecastByCoords(lat, lon),
            fetchAirQualityByCoords(lat, lon)
        ]);
        
        appState.currentWeather = weatherData;
        appState.forecast = forecastData;
        appState.airQuality = airQualityData;
        
        updateUI();
        updateForecastUI();
        updateAirQualityUI();
        
        appState.lastUpdate = new Date();
        updateLastUpdated();
        
    } catch (error) {
        showNotification('Failed to fetch location weather', 'error');
        console.error('Error fetching location weather:', error);
    }
}

// Fetch current weather
async function fetchWeather(city) {
    const response = await fetch(
        `${BASE_URL}/weather?q=${city}&units=${appState.units}&appid=${API_KEY}`
    );
    
    if (!response.ok) throw new Error('City not found');
    return await response.json();
}

// Fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
    const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${appState.units}&appid=${API_KEY}`
    );
    
    if (!response.ok) throw new Error('Weather data not found');
    return await response.json();
}

// Fetch forecast
async function fetchForecast(city) {
    const response = await fetch(
        `${BASE_URL}/forecast?q=${city}&units=${appState.units}&appid=${API_KEY}`
    );
    
    if (!response.ok) throw new Error('Forecast not found');
    return await response.json();
}

// Fetch forecast by coordinates
async function fetchForecastByCoords(lat, lon) {
    const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${appState.units}&appid=${API_KEY}`
    );
    
    if (!response.ok) throw new Error('Forecast not found');
    return await response.json();
}

// Fetch air quality
async function fetchAirQuality(city) {
    // First get coordinates for the city
    const geoResponse = await fetch(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}`
    );
    
    if (!geoResponse.ok) return null;
    
    const geoData = await geoResponse.json();
    const { lat, lon } = geoData.coord;
    
    // Then fetch air quality
    const aqResponse = await fetch(
        `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (!aqResponse.ok) return null;
    return await aqResponse.json();
}

// Fetch air quality by coordinates
async function fetchAirQualityByCoords(lat, lon) {
    const response = await fetch(
        `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (!response.ok) return null;
    return await response.json();
}

// Update main UI
function updateUI() {
    const weather = appState.currentWeather;
    if (!weather) return;
    
    // Update location
    cityName.textContent = weather.name;
    country.textContent = weather.sys.country;
    
    // Update temperature
    currentTemp.textContent = Math.round(weather.main.temp);
    feelsLike.textContent = Math.round(weather.main.feels_like);
    
    // Update weather condition
    const iconCode = weather.weather[0].icon;
    weatherIcon.className = WEATHER_ICONS[iconCode] || 'fas fa-cloud';
    weatherDescription.textContent = weather.weather[0].description;
    
    // Update details
    windSpeed.textContent = `${weather.wind.speed} ${appState.units === 'metric' ? 'km/h' : 'mph'}`;
    windDirection.textContent = getWindDirection(weather.wind.deg);
    humidity.textContent = `${weather.main.humidity}%`;
    pressure.textContent = `${weather.main.pressure} hPa`;
    visibility.textContent = `${(weather.visibility / 1000).toFixed(1)} km`;
    cloudiness.textContent = `${weather.clouds.all}%`;
    
    // Update sunrise/sunset
    sunrise.textContent = formatTime(weather.sys.sunrise);
    sunset.textContent = formatTime(weather.sys.sunset);
    
    // Update UV index (mock - real API needs separate call)
    uvIndex.textContent = calculateUVIndex(weather);
}

// Update forecast UI
function updateForecastUI() {
    if (!appState.forecast) return;
    
    updateHourlyForecast();
    updateDailyForecast();
}

// Update hourly forecast
function updateHourlyForecast() {
    const hourlyScroll = document.querySelector('.hourly-scroll');
    hourlyScroll.innerHTML = '';
    
    // Get next 24 hours
    const hours = appState.forecast.list.slice(0, 8);
    
    hours.forEach(hour => {
        const time = new Date(hour.dt * 1000);
        const temp = Math.round(hour.main.temp);
        const iconCode = hour.weather[0].icon;
        const iconClass = WEATHER_ICONS[iconCode] || 'fas fa-cloud';
        
        const hourCard = document.createElement('div');
        hourCard.className = 'hour-card';
        hourCard.innerHTML = `
            <div class="time">${formatHour(time)}</div>
            <i class="${iconClass} icon"></i>
            <div class="temp">${temp}°</div>
            <div class="condition">${hour.weather[0].description}</div>
        `;
        
        hourlyScroll.appendChild(hourCard);
    });
}

// Update daily forecast
function updateDailyForecast() {
    const dailyContainer = document.getElementById('dailyForecast');
    dailyContainer.innerHTML = '';
    
    // Group forecast by day
    const dailyForecasts = {};
    appState.forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        if (!dailyForecasts[day]) {
            dailyForecasts[day] = {
                temps: [],
                conditions: [],
                icons: []
            };
        }
        
        dailyForecasts[day].temps.push(item.main.temp);
        dailyForecasts[day].conditions.push(item.weather[0].description);
        dailyForecasts[day].icons.push(item.weather[0].icon);
    });
    
    // Create day cards for next 5 days
    const days = Object.keys(dailyForecasts).slice(0, 5);
    
    days.forEach(day => {
        const data = dailyForecasts[day];
        const highTemp = Math.round(Math.max(...data.temps));
        const lowTemp = Math.round(Math.min(...data.temps));
        const avgIcon = getMostFrequentIcon(data.icons);
        
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        dayCard.innerHTML = `
            <div class="day-info">
                <div class="day-name">${day}</div>
                <i class="${WEATHER_ICONS[avgIcon] || 'fas fa-cloud'} day-icon"></i>
                <div class="day-condition">${data.conditions[0]}</div>
            </div>
            <div class="day-temps">
                <div class="high-temp">${highTemp}°</div>
                <div class="low-temp">${lowTemp}°</div>
            </div>
        `;
        
        dailyContainer.appendChild(dayCard);
    });
}

// Update air quality UI
function updateAirQualityUI() {
    if (!appState.airQuality) return;
    
    const aqi = appState.airQuality.list[0].main.aqi;
    const components = appState.airQuality.list[0].components;
    
    // Update AQI value
    aqiValue.textContent = aqi;
    
    // Update AQI status and color
    let status = '';
    let description = '';
    let colorClass = '';
    
    switch(aqi) {
        case 1:
            status = 'Good';
            description = 'Air quality is satisfactory';
            colorClass = 'good';
            break;
        case 2:
            status = 'Fair';
            description = 'Air quality is acceptable';
            colorClass = 'moderate';
            break;
        case 3:
            status = 'Moderate';
            description = 'Sensitive groups should limit outdoor activities';
            colorClass = 'unhealthy';
            break;
        case 4:
            status = 'Poor';
            description = 'Health effects possible for everyone';
            colorClass = 'unhealthy';
            break;
        case 5:
            status = 'Very Poor';
            description = 'Health warning of emergency conditions';
            colorClass = 'hazardous';
            break;
    }
    
    aqiStatus.textContent = status;
    aqiDescription.textContent = description;
    document.querySelector('.aqi-circle').className = `aqi-circle ${colorClass}`;
    
    // Update pollutant bars
    updatePollutantBar('pm25', components.pm2_5, 50);
    updatePollutantBar('pm10', components.pm10, 100);
    updatePollutantBar('o3', components.o3, 180);
}

// Update pollutant bar
function updatePollutantBar(pollutant, value, max) {
    const bar = document.getElementById(`${pollutant}Bar`);
    const valueElement = document.getElementById(`${pollutant}Value`);
    
    if (bar && valueElement) {
        const percentage = Math.min((value / max) * 100, 100);
        bar.style.width = `${percentage}%`;
        valueElement.textContent = value.toFixed(1);
        
        // Set color based on value
        if (value < max * 0.3) {
            bar.style.background = 'var(--success)';
        } else if (value < max * 0.6) {
            bar.style.background = 'var(--warning)';
        } else {
            bar.style.background = 'var(--danger)';
        }
    }
}

// Update chart
function updateChart() {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    
    // Destroy existing chart
    if (appState.chart) {
        appState.chart.destroy();
    }
    
    // Create new chart data from forecast
    const labels = [];
    const temps = [];
    
    appState.forecast.list.slice(0, 8).forEach(item => {
        const time = new Date(item.dt * 1000);
        labels.push(formatHour(time));
        temps.push(item.main.temp);
    });
    
    appState.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: 'var(--primary)',
                backgroundColor: 'rgba(58, 134, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'var(--dark)'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'var(--dark)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'var(--dark)'
                    }
                }
            }
        }
    });
}

// Helper Functions
function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function formatHour(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        hour12: true
    }).replace(' ', '');
}

function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

function getMostFrequentIcon(icons) {
    const frequency = {};
    let max = 0;
    let result = '';
    
    icons.forEach(icon => {
        frequency[icon] = (frequency[icon] || 0) + 1;
        if (frequency[icon] > max) {
            max = frequency[icon];
            result = icon;
        }
    });
    
    return result;
}

function calculateUVIndex(weather) {
    // Mock UV index calculation
    // In production, use OpenWeatherMap's UV index API
    const hour = new Date().getHours();
    const cloudCover = weather.clouds.all;
    let baseUV = 0;
    
    if (hour >= 10 && hour <= 14) {
        baseUV = 8;
    } else if (hour >= 8 && hour <= 16) {
        baseUV = 6;
    } else {
        baseUV = 2;
    }
    
    // Adjust for cloud cover
    const adjustedUV = Math.round(baseUV * (1 - cloudCover / 200));
    return Math.max(1, adjustedUV);
}

function updateDateTime() {
    const now = new Date();
    currentDate.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update every minute
    setTimeout(updateDateTime, 60000);
}

function updateLastUpdated() {
    if (appState.lastUpdate) {
        lastUpdated.textContent = appState.lastUpdate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
}

function saveUserSettings() {
    const apiKey = document.getElementById('apiKeyInput').value;
    if (apiKey) {
        // In production, you would save this securely
        showNotification('Settings saved!', 'success');
    }
    settingsModal.classList.remove('active');
}

function showLoading() {
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show and auto-remove
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function startAutoRefresh() {
    const interval = localStorage.getItem('refreshInterval') || 15;
    if (interval > 0) {
        setInterval(() => {
            if (appState.currentCity) {
                getWeatherData(appState.currentCity);
            }
        }, interval * 60000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', initApp);