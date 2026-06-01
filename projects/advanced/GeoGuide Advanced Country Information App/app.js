        // API URL as per your requirement
        const API_URL = "https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region,languages,currencies,borders,cca3";
        
        // Global variables
        let allCountries = [];
        let currentCountry = null;
        let map = null;
        let countryMarkers = [];
        let useFallbackData = false;
        
        // DOM Elements
        const searchInput = document.getElementById('searchInput');
        const regionFilter = document.getElementById('regionFilter');
        const searchBtn = document.getElementById('searchBtn');
        const randomCountryBtn = document.getElementById('randomCountry');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const errorMessage = document.getElementById('errorMessage');
        const viewButtons = document.querySelectorAll('.view-btn');
        const views = document.querySelectorAll('.view');
        const apiStatus = document.getElementById('apiStatus');
        const searchSuggestions = document.getElementById('searchSuggestions');
        
        // Fallback country data (in case API fails)
        const fallbackCountries = [
            {
                name: { common: "United States", official: "United States of America" },
                capital: ["Washington, D.C."],
                region: "Americas",
                population: 329484123,
                area: 9833520,
                currencies: { USD: { name: "United States dollar", symbol: "$" } },
                languages: { eng: "English" },
                latlng: [38.0, -97.0],
                timezones: ["UTC-10:00", "UTC-09:00", "UTC-08:00", "UTC-07:00", "UTC-06:00", "UTC-05:00"],
                continents: ["North America"],
                flags: { png: "https://flagcdn.com/w320/us.png", svg: "https://flagcdn.com/us.svg" },
                cca2: "US",
                cca3: "USA",
                idd: { root: "+1", suffixes: [] },
                borders: ["CAN", "MEX"]
            },
            {
                name: { common: "India", official: "Republic of India" },
                capital: ["New Delhi"],
                region: "Asia",
                population: 1380004385,
                area: 3287263,
                currencies: { INR: { name: "Indian rupee", symbol: "₹" } },
                languages: { eng: "English", hin: "Hindi" },
                latlng: [20.0, 77.0],
                timezones: ["UTC+05:30"],
                flags: { png: "https://flagcdn.com/w320/in.png", svg: "https://flagcdn.com/in.svg" },
                cca2: "IN",
                cca3: "IND",
                idd: { root: "+9", suffixes: ["1"] },
                borders: ["BGD", "BTN", "MMR", "CHN", "NPL", "PAK"]
            },
            {
                name: { common: "Japan", official: "Japan" },
                capital: ["Tokyo"],
                region: "Asia",
                population: 125836021,
                area: 377930,
                currencies: { JPY: { name: "Japanese yen", symbol: "¥" } },
                languages: { jpn: "Japanese" },
                latlng: [36.0, 138.0],
                timezones: ["UTC+09:00"],
                flags: { png: "https://flagcdn.com/w320/jp.png", svg: "https://flagcdn.com/jp.svg" },
                cca2: "JP",
                cca3: "JPN",
                idd: { root: "+8", suffixes: ["1"] }
            },
            {
                name: { common: "Germany", official: "Federal Republic of Germany" },
                capital: ["Berlin"],
                region: "Europe",
                population: 83240525,
                area: 357114,
                currencies: { EUR: { name: "Euro", symbol: "€" } },
                languages: { deu: "German" },
                latlng: [51.0, 9.0],
                timezones: ["UTC+01:00"],
                flags: { png: "https://flagcdn.com/w320/de.png", svg: "https://flagcdn.com/de.svg" },
                cca2: "DE",
                cca3: "DEU",
                borders: ["AUT", "BEL", "CZE", "DNK", "FRA", "LUX", "NLD", "POL", "CHE"]
            },
            {
                name: { common: "Brazil", official: "Federative Republic of Brazil" },
                capital: ["Brasília"],
                region: "Americas",
                population: 212559409,
                area: 8515767,
                currencies: { BRL: { name: "Brazilian real", symbol: "R$" } },
                languages: { por: "Portuguese" },
                latlng: [-10.0, -55.0],
                timezones: ["UTC-05:00", "UTC-04:00", "UTC-03:00", "UTC-02:00"],
                flags: { png: "https://flagcdn.com/w320/br.png", svg: "https://flagcdn.com/br.svg" },
                cca2: "BR",
                cca3: "BRA",
                borders: ["ARG", "BOL", "COL", "GUF", "GUY", "PRY", "PER", "SUR", "URY", "VEN"]
            }
        ];
        
        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            initApp();
            
            // Event listeners
            searchInput.addEventListener('input', handleSearchInput);
            searchInput.addEventListener('focus', showSearchSuggestions);
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
            regionFilter.addEventListener('change', filterCountriesByRegion);
            randomCountryBtn.addEventListener('click', getRandomCountry);
            
            // Hide suggestions when clicking outside
            document.addEventListener('click', function(e) {
                if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                    searchSuggestions.style.display = 'none';
                }
            });
            
            // View controls
            viewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const view = this.getAttribute('data-view');
                    switchView(view);
                });
            });
        });
        
        // Initialize the app
        async function initApp() {
            showLoading();
            updateApiStatus("Connecting to API...");
            
            try {
                // Use the specified API URL
                console.log("Fetching data from:", API_URL);
                const response = await fetch(API_URL);
                
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }
                
                allCountries = await response.json();
                console.log("Data loaded successfully:", allCountries.length, "countries");
                
                // Sort countries alphabetically
                allCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));
                
                // Add missing data for fallback
                allCountries = allCountries.map(country => {
                    // Add estimated coordinates based on region
                    if (!country.latlng) {
                        country.latlng = getEstimatedCoordinates(country.region);
                    }
                    
                    // Add estimated area if missing
                    if (!country.area) {
                        country.area = getEstimatedArea(country.population, country.region);
                    }
                    
                    // Add cca2 if missing
                    if (!country.cca2 && country.cca3) {
                        country.cca2 = country.cca3.substring(0, 2);
                    }
                    
                    return country;
                });
                
                // Set initial country (United States)
                const usa = allCountries.find(country => 
                    country.name.common === "United States" || 
                    country.name.common === "United States of America"
                );
                
                if (usa) {
                    currentCountry = usa;
                    updateCountryInfo(usa);
                    initMap(usa);
                } else if (allCountries.length > 0) {
                    // If US not found, use first country
                    currentCountry = allCountries[0];
                    updateCountryInfo(allCountries[0]);
                    initMap(allCountries[0]);
                }
                
                // Populate country lists for comparison
                populateCountryLists();
                
                // Populate all countries list
                populateAllCountriesList();
                
                updateApiStatus("Online", true);
                hideLoading();
                
            } catch (error) {
                console.error("API Error:", error);
                
                // Use fallback data
                allCountries = fallbackCountries;
                useFallbackData = true;
                updateApiStatus("Using Local Data", false);
                
                // Set initial country from fallback
                if (allCountries.length > 0) {
                    currentCountry = allCountries[0];
                    updateCountryInfo(allCountries[0]);
                    initMap(allCountries[0]);
                    populateCountryLists();
                    populateAllCountriesList();
                }
                
                hideLoading();
                showError("Using offline data. Some features may be limited.");
            }
        }
        
        // Get estimated coordinates based on region
        function getEstimatedCoordinates(region) {
            const regionCoordinates = {
                "Africa": [8, 20],
                "Americas": [10, -85],
                "Asia": [34, 100],
                "Europe": [54, 15],
                "Oceania": [-25, 140]
            };
            return regionCoordinates[region] || [0, 0];
        }
        
        // Get estimated area based on population and region
        function getEstimatedArea(population, region) {
            const densityByRegion = {
                "Africa": 45,
                "Americas": 25,
                "Asia": 150,
                "Europe": 34,
                "Oceania": 5
            };
            const density = densityByRegion[region] || 50;
            return Math.round(population / density);
        }
        
        // Handle search input with suggestions
        function handleSearchInput() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm.length === 0) {
                searchSuggestions.style.display = 'none';
                hideError();
                return;
            }
            
            // Show suggestions
            showSearchSuggestions();
        }
        
        // Perform search when search button is clicked
        function performSearch() {
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm.length === 0) {
                showError("Please enter a country name to search");
                return;
            }
            
            const foundCountry = findCountryByName(searchTerm);
            
            if (foundCountry) {
                currentCountry = foundCountry;
                updateCountryInfo(foundCountry);
                showOverviewView();
                hideError();
                searchSuggestions.style.display = 'none';
            } else {
                showError(`Country "${searchTerm}" not found. Try: India, USA, Japan, etc.`);
            }
        }
        
        // Find country by name (with fuzzy matching)
        function findCountryByName(searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            
            // Try exact match first
            let found = allCountries.find(country => 
                country.name.common.toLowerCase() === searchLower ||
                (country.name.official && country.name.official.toLowerCase() === searchLower)
            );
            
            if (found) return found;
            
            // Try partial match
            found = allCountries.find(country => 
                country.name.common.toLowerCase().includes(searchLower) ||
                (country.name.official && country.name.official.toLowerCase().includes(searchLower))
            );
            
            if (found) return found;
            
            // Try capital match
            found = allCountries.find(country => 
                country.capital && 
                country.capital[0] && 
                country.capital[0].toLowerCase().includes(searchLower)
            );
            
            return found;
        }
        
        // Show search suggestions
        function showSearchSuggestions() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm.length === 0) {
                // Show popular countries as suggestions when input is empty
                const popularCountries = ["United States", "India", "China", "Japan", "Germany", "France", "Brazil", "Australia", "Canada", "United Kingdom"];
                const suggestions = allCountries.filter(country => 
                    popularCountries.includes(country.name.common)
                ).slice(0, 8);
                
                displaySearchSuggestions(suggestions, true);
                return;
            }
            
            // Filter countries based on search term
            const filteredCountries = allCountries.filter(country => {
                const countryName = country.name.common ? country.name.common.toLowerCase() : '';
                const capitalName = country.capital && country.capital[0] ? country.capital[0].toLowerCase() : '';
                
                return (
                    countryName.includes(searchTerm) ||
                    capitalName.includes(searchTerm) ||
                    (country.name.official && country.name.official.toLowerCase().includes(searchTerm))
                );
            });
            
            // Display suggestions
            displaySearchSuggestions(filteredCountries.slice(0, 10), false);
        }
        
        // Display search suggestions
        function displaySearchSuggestions(countries, isDefault = false) {
            searchSuggestions.innerHTML = '';
            
            if (countries.length === 0) {
                const noResults = document.createElement('div');
                noResults.className = 'suggestion-item';
                noResults.innerHTML = `<span class="suggestion-text">No countries found</span>`;
                searchSuggestions.appendChild(noResults);
            } else {
                countries.forEach(country => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.innerHTML = `
                        <span class="suggestion-flag">${getFlagEmoji(country.cca3 ? country.cca3.substring(0, 2) : '')}</span>
                        <span class="suggestion-text">${country.name.common}</span>
                        <span class="suggestion-subtext">${country.capital ? country.capital[0] : ''} • ${country.region}</span>
                    `;
                    
                    suggestionItem.addEventListener('click', () => {
                        currentCountry = country;
                        updateCountryInfo(country);
                        searchInput.value = country.name.common;
                        searchSuggestions.style.display = 'none';
                        showOverviewView();
                        hideError();
                    });
                    
                    searchSuggestions.appendChild(suggestionItem);
                });
            }
            
            searchSuggestions.style.display = 'block';
        }
        
        // Update API status display
        function updateApiStatus(message, isOnline = null) {
            const statusIcon = apiStatus.querySelector('i');
            const statusText = apiStatus.querySelector('span');
            
            statusText.textContent = message;
            
            if (isOnline === true) {
                apiStatus.classList.remove('offline');
                apiStatus.classList.add('online');
                statusIcon.style.color = '#2ecc71';
            } else if (isOnline === false) {
                apiStatus.classList.remove('online');
                apiStatus.classList.add('offline');
                statusIcon.style.color = '#e74c3c';
            } else {
                apiStatus.classList.remove('online', 'offline');
                statusIcon.style.color = '#f39c12';
            }
        }
        
        // Update country information display
        function updateCountryInfo(country) {
            document.getElementById('countryName').textContent = country.name.common;
            document.getElementById('countryFlag').textContent = getFlagEmoji(country.cca3 ? country.cca3.substring(0, 2) : 'US');
            document.getElementById('countryCapital').textContent = country.capital ? country.capital[0] : 'N/A';
            document.getElementById('countryRegion').textContent = country.region || 'N/A';
            document.getElementById('countryPopulation').textContent = formatNumber(country.population);
            
            // Calculate population density if area exists
            if (country.area) {
                const density = country.population / country.area;
                document.getElementById('countryPopulationDensity').textContent = isNaN(density) ? 'N/A' : density.toFixed(1);
                document.getElementById('countryArea').textContent = formatNumber(country.area) + ' km²';
            } else {
                document.getElementById('countryPopulationDensity').textContent = 'N/A';
                document.getElementById('countryArea').textContent = 'N/A';
            }
            
            // Currency
            if (country.currencies) {
                const currencyCode = Object.keys(country.currencies)[0];
                const currency = country.currencies[currencyCode];
                document.getElementById('countryCurrency').textContent = `${currency.name} (${currencyCode})`;
            } else {
                document.getElementById('countryCurrency').textContent = 'N/A';
            }
            
            // Languages
            if (country.languages) {
                const languages = Object.values(country.languages).join(', ');
                document.getElementById('countryLanguages').textContent = languages;
            } else {
                document.getElementById('countryLanguages').textContent = 'N/A';
            }
            
            // Borders
            if (country.borders && country.borders.length > 0) {
                const borderNames = country.borders.map(code => {
                    const borderCountry = allCountries.find(c => c.cca3 === code);
                    return borderCountry ? borderCountry.name.common : code;
                }).join(', ');
                
                document.getElementById('countryBorders').textContent = borderNames;
                document.getElementById('countryBordersCount').textContent = country.borders.length;
            } else {
                document.getElementById('countryBorders').textContent = 'None';
                document.getElementById('countryBordersCount').textContent = '0';
            }
            
            // Country code
            document.getElementById('countryCode').textContent = country.cca3 || 'N/A';
            
            // Coordinates for display
            if (country.latlng && country.latlng.length >= 2) {
                const lat = country.latlng[0];
                const lng = country.latlng[1];
                document.getElementById('countryCoordinates').textContent = 
                    `${lat.toFixed(1)}° ${lat > 0 ? 'N' : 'S'}, ${lng.toFixed(1)}° ${lng > 0 ? 'E' : 'W'}`;
            } else {
                document.getElementById('countryCoordinates').textContent = 'N/A';
            }
            
            // Continent/Subregion - using region as fallback
            document.getElementById('countryContinent').textContent = country.region || 'N/A';
            document.getElementById('countrySubregion').textContent = country.subregion || 'N/A';
            
            // Update map
            updateMap(country);
        }
        
        // Initialize the map
        function initMap(country) {
            if (!map) {
                const lat = country.latlng ? country.latlng[0] : 0;
                const lng = country.latlng ? country.latlng[1] : 0;
                map = L.map('countryMap').setView([lat, lng], 4);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
            }
            
            updateMap(country);
        }
        
        // Update the map with country location
        function updateMap(country) {
            if (!map) return;
            
            // Clear existing markers
            countryMarkers.forEach(marker => map.removeLayer(marker));
            countryMarkers = [];
            
            // Add marker for the country
            if (country.latlng && country.latlng.length >= 2) {
                const marker = L.marker([country.latlng[0], country.latlng[1]])
                    .addTo(map)
                    .bindPopup(`<b>${country.name.common}</b><br>${country.capital ? country.capital[0] : 'No capital'}`)
                    .openPopup();
                
                countryMarkers.push(marker);
                
                // Center map on the country
                const zoomLevel = country.area > 1000000 ? 3 : (country.area > 500000 ? 4 : 5);
                map.setView([country.latlng[0], country.latlng[1]], zoomLevel);
            }
        }
        
        // Filter countries by region
        function filterCountriesByRegion() {
            const region = regionFilter.value;
            
            if (!region) {
                // If "All Regions" is selected, show overview
                showOverviewView();
                hideError();
                return;
            }
            
            const filteredCountries = allCountries.filter(country => country.region === region);
            
            if (filteredCountries.length > 0) {
                // Show first country in the region
                currentCountry = filteredCountries[0];
                updateCountryInfo(filteredCountries[0]);
                showOverviewView();
                hideError();
            } else {
                showError(`No countries found in region "${region}"`);
            }
        }
        
        // Get a random country
        function getRandomCountry() {
            const randomIndex = Math.floor(Math.random() * allCountries.length);
            currentCountry = allCountries[randomIndex];
            updateCountryInfo(currentCountry);
            showOverviewView();
            hideError();
        }
        
        // Populate country lists for comparison
        function populateCountryLists() {
            const countryList1 = document.getElementById('countryList1');
            const countryList2 = document.getElementById('countryList2');
            
            countryList1.innerHTML = '';
            countryList2.innerHTML = '';
            
            allCountries.forEach(country => {
                const countryItem1 = createCountryListItem(country);
                const countryItem2 = countryItem1.cloneNode(true);
                
                // Add event listeners
                countryItem1.addEventListener('click', () => selectCountryForComparison(country, 1));
                countryItem2.addEventListener('click', () => selectCountryForComparison(country, 2));
                
                countryList1.appendChild(countryItem1);
                countryList2.appendChild(countryItem2);
            });
        }
        
        // Populate all countries list
        function populateAllCountriesList() {
            const allCountriesList = document.getElementById('allCountriesList');
            allCountriesList.innerHTML = '';
            
            allCountries.forEach(country => {
                const countryItem = createCountryListItem(country);
                countryItem.addEventListener('click', () => {
                    currentCountry = country;
                    updateCountryInfo(country);
                    showOverviewView();
                });
                allCountriesList.appendChild(countryItem);
            });
        }
        
        // Create a country list item
        function createCountryListItem(country) {
            const div = document.createElement('div');
            div.className = 'country-item';
            div.innerHTML = `
                <span class="country-flag-small">${getFlagEmoji(country.cca3 ? country.cca3.substring(0, 2) : '')}</span>
                <span class="country-name">${country.name.common}</span>
                <span class="country-region">${country.region}</span>
            `;
            return div;
        }
        
        // Select a country for comparison
        let compareCountry1 = null;
        let compareCountry2 = null;
        
        function selectCountryForComparison(country, listNum) {
            if (listNum === 1) {
                compareCountry1 = country;
                updateActiveCountryListItems('countryList1', country);
            } else {
                compareCountry2 = country;
                updateActiveCountryListItems('countryList2', country);
            }
            
            // If both countries are selected, show comparison
            if (compareCountry1 && compareCountry2) {
                compareCountries(compareCountry1, compareCountry2);
            }
        }
        
        // Update active state for country list items
        function updateActiveCountryListItems(listId, selectedCountry) {
            const list = document.getElementById(listId);
            const items = list.querySelectorAll('.country-item');
            
            items.forEach(item => {
                const countryName = item.querySelector('.country-name').textContent;
                if (countryName === selectedCountry.name.common) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
        
        // Compare two countries
        function compareCountries(country1, country2) {
            const comparisonResult = document.getElementById('comparisonResult');
            const comparisonData = document.getElementById('comparisonData');
            
            comparisonResult.classList.remove('hidden');
            
            const populationDiff = country1.population - country2.population;
            const area1 = country1.area || getEstimatedArea(country1.population, country1.region);
            const area2 = country2.area || getEstimatedArea(country2.population, country2.region);
            const areaDiff = area1 - area2;
            
            // Calculate population density
            const density1 = area1 > 0 ? (country1.population / area1).toFixed(1) : 'N/A';
            const density2 = area2 > 0 ? (country2.population / area2).toFixed(1) : 'N/A';
            
            comparisonData.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center;">
                    <div>
                        <h3>${country1.name.common}</h3>
                        <div class="flag" style="font-size: 3rem;">${getFlagEmoji(country1.cca3 ? country1.cca3.substring(0, 2) : '')}</div>
                    </div>
                    <div>
                        <h3>Comparison</h3>
                        <div style="font-size: 2rem; color: var(--secondary); margin: 20px 0;">
                            <i class="fas fa-balance-scale"></i>
                        </div>
                    </div>
                    <div>
                        <h3>${country2.name.common}</h3>
                        <div class="flag" style="font-size: 3rem;">${getFlagEmoji(country2.cca3 ? country2.cca3.substring(0, 2) : '')}</div>
                    </div>
                </div>
                
                <div class="info-grid" style="margin-top: 30px;">
                    <div class="info-item">
                        <div class="info-label">Population</div>
                        <div class="info-value">${formatNumber(country1.population)}</div>
                    </div>
                    <div class="info-item" style="background-color: #f0f8ff;">
                        <div class="info-label">Difference</div>
                        <div class="info-value" style="color: ${populationDiff > 0 ? 'var(--success)' : 'var(--accent)'}">
                            ${populationDiff > 0 ? '+' : ''}${formatNumber(populationDiff)}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Population</div>
                        <div class="info-value">${formatNumber(country2.population)}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">Area</div>
                        <div class="info-value">${formatNumber(area1)} km²</div>
                    </div>
                    <div class="info-item" style="background-color: #f0f8ff;">
                        <div class="info-label">Difference</div>
                        <div class="info-value" style="color: ${areaDiff > 0 ? 'var(--success)' : 'var(--accent)'}">
                            ${areaDiff > 0 ? '+' : ''}${formatNumber(areaDiff)} km²
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Area</div>
                        <div class="info-value">${formatNumber(area2)} km²</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">Population Density</div>
                        <div class="info-value">${density1} people/km²</div>
                    </div>
                    <div class="info-item" style="background-color: #f0f8ff;">
                        <div class="info-label">Comparison</div>
                        <div class="info-value">
                            ${density1 !== 'N/A' && density2 !== 'N/A' ? 
                              (parseFloat(density1) > parseFloat(density2) ? 'More dense' : 'Less dense') : 
                              'N/A'}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Population Density</div>
                        <div class="info-value">${density2} people/km²</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">Capital</div>
                        <div class="info-value">${country1.capital ? country1.capital[0] : 'N/A'}</div>
                    </div>
                    <div class="info-item" style="background-color: #f0f8ff;">
                        <div class="info-label">Region</div>
                        <div class="info-value">${country1.region === country2.region ? 'Same' : 'Different'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Capital</div>
                        <div class="info-value">${country2.capital ? country2.capital[0] : 'N/A'}</div>
                    </div>
                </div>
            `;
            
            // Scroll to comparison results
            comparisonResult.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Switch between views
        function switchView(view) {
            // Update active button
            viewButtons.forEach(button => {
                if (button.getAttribute('data-view') === view) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
            
            // Show selected view, hide others
            views.forEach(viewElement => {
                if (viewElement.id === `${view}View`) {
                    viewElement.classList.remove('hidden');
                } else {
                    viewElement.classList.add('hidden');
                }
            });
            
            // If switching to comparison view, ensure the comparison result is hidden initially
            if (view === 'comparison') {
                document.getElementById('comparisonResult').classList.add('hidden');
                compareCountry1 = null;
                compareCountry2 = null;
                
                // Reset active items in comparison lists
                const items1 = document.querySelectorAll('#countryList1 .country-item');
                const items2 = document.querySelectorAll('#countryList2 .country-item');
                items1.forEach(item => item.classList.remove('active'));
                items2.forEach(item => item.classList.remove('active'));
            }
            
            // Hide error when switching views
            hideError();
        }
        
        // Show overview view
        function showOverviewView() {
            switchView('overview');
        }
        
        // Utility functions
        function formatNumber(num) {
            return new Intl.NumberFormat().format(num);
        }
        
        function getFlagEmoji(countryCode) {
            if (!countryCode || countryCode.length !== 2) return '🏳️';
            
            // Try to generate flag emoji
            try {
                const codePoints = countryCode
                    .toUpperCase()
                    .split('')
                    .map(char => 127397 + char.charCodeAt());
                return String.fromCodePoint(...codePoints);
            } catch (e) {
                // Return default flag if emoji generation fails
                return '🏳️';
            }
        }
        
        function showLoading() {
            loadingIndicator.style.display = 'block';
            errorMessage.style.display = 'none';
        }
        
        function hideLoading() {
            loadingIndicator.style.display = 'none';
        }
        
        function showError(message) {
            errorMessage.style.display = 'block';
            document.getElementById('errorText').textContent = message;
            hideLoading();
        }
        
        function hideError() {
            errorMessage.style.display = 'none';
        }