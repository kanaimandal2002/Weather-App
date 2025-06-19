document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'b0d660e269b1d765ea95151d897a5e3c'; 
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    const weatherInfo = document.getElementById('weather-info');
    
    searchBtn.addEventListener('click', fetchWeather);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchWeather();
        }
    });
    
    function fetchWeather() {
        const city = cityInput.value.trim();
        if (!city) {
            alert('Please enter a city name');
            return;
        }
        
        // Added error handling for API key
        if (!apiKey || apiKey === 'YOUR_API_KEY') {
            weatherInfo.innerHTML = '<p style="color: red;">API key is missing or invalid</p>';
            console.error('API key is missing or invalid');
            return;
        }
        
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    // More detailed error message
                    if (response.status === 401) {
                        throw new Error('Invalid API key - Please check your OpenWeatherMap API key');
                    } else if (response.status === 404) {
                        throw new Error('City not found');
                    } else {
                        throw new Error(`Error: ${response.status}`);
                    }
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                weatherInfo.innerHTML = `<p style="color: red;">${error.message}</p>`;
                console.error('Error fetching weather:', error);
            });
    }
    
    function displayWeather(data) {
        const { name } = data;
        const { temp, humidity } = data.main;
        const { description, icon } = data.weather[0];
        
        weatherInfo.innerHTML = `
            <h2>${name}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}" class="weather-icon">
            <div class="temperature">${Math.round(temp)}°C</div>
            <div class="weather-description">${description}</div>
            <div class="humidity">Humidity: ${humidity}%</div>
        `;
    }
});
