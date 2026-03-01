// 1. Configuration
const API_KEY = 'enter your api key '; // Replace this!
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// 2. DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMsg = document.getElementById('errorMsg');

// 3. Core Logic: Fetch and Display
async function fetchWeather(query, isCoord = false) {
    try {
        errorMsg.innerText = ''; // Clear previous errors
        
        // Build URL based on whether we have coordinates or a city name
        const url = isCoord 
            ? `${BASE_URL}?lat=${query.lat}&lon=${query.lon}&units=metric&appid=${API_KEY}`
            : `${BASE_URL}?q=${query}&units=metric&appid=${API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found.");
        
        const data = await response.json();
        renderWeather(data);
    } catch (err) {
        errorMsg.innerText = err.message;
        weatherDisplay.style.display = 'none';
    }
}

// 4. Update the UI
function renderWeather(data) {
    weatherDisplay.style.display = 'block';
    document.getElementById('cityName').innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById('condition').innerText = data.weather[0].main;
    document.getElementById('humidity').innerText = data.main.humidity;
    document.getElementById('windSpeed').innerText = data.wind.speed;
}

// 5. Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

// Auto-detect location on load
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }, true),
            (err) => console.log("Location access denied")
        );
    }
});