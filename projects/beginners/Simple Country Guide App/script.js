const countriesContainer = document.getElementById('countries-container');
const searchInput = document.getElementById('search');
const regionFilter = document.getElementById('region-filter');
const themeToggle = document.getElementById('theme-toggle');

let countriesData = [];

// Correct API URL with fields to avoid 400 error
const API_URL = "https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region,languages,currencies,borders,cca3";

// Fetch countries from API
async function fetchCountries() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        countriesData = data;
        displayCountries(countriesData);
    } catch (error) {
        countriesContainer.innerHTML = "<p>Error fetching countries! Check console.</p>";
        console.error("Fetch error:", error);
    }
}

// Display countries
function displayCountries(countries) {
    countriesContainer.innerHTML = '';

    countries.forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.classList.add('country-card');
        countryCard.innerHTML = `
            <img src="${country.flags?.png}" alt="Flag of ${country.name.common}" />
            <div class="card-body">
                <h2>${country.name.common}</h2>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Currency:</strong> ${getCurrencies(country)}</p>
                <p><strong>Languages:</strong> ${getLanguages(country)}</p>
            </div>
        `;
        // Clickable neighbor countries
        countryCard.addEventListener('click', () => {
            if (country.borders) {
                const neighbors = countriesData.filter(c => country.borders.includes(c.cca3));
                displayCountries(neighbors);
            } else {
                alert("No neighboring countries!");
            }
        });
        countriesContainer.appendChild(countryCard);
    });
}

// Helper functions
function getCurrencies(country) {
    if (!country.currencies) return 'N/A';
    return Object.values(country.currencies).map(c => c.name).join(', ');
}

function getLanguages(country) {
    if (!country.languages) return 'N/A';
    return Object.values(country.languages).join(', ');
}

// Search functionality
searchInput.addEventListener('input', () => {
    const filtered = countriesData.filter(country => 
        country.name.common.toLowerCase().includes(searchInput.value.toLowerCase())
    );
    displayCountries(filtered);
});

// Region filter
regionFilter.addEventListener('change', () => {
    if (regionFilter.value === '') {
        displayCountries(countriesData);
    } else {
        const filtered = countriesData.filter(c => c.region === regionFilter.value);
        displayCountries(filtered);
    }
});

// Dark Mode Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
});

// Initialize
fetchCountries();
