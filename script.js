const API_KEY = 'b43c2f0b6a03f3554f66db559704d7fe';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    searchWeather();
  }
}

async function searchWeather() {
  const city = document.getElementById('cityInput').value.trim();
  document.getElementById('errorBox').classList.add('hidden');

  if (!city) {
    alert('Please enter a city name!');
    return;
  }

  updateApiStatus('Fetching data...', 'yellow');

  try {
    const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    if (response.ok) {
      displayWeather(data);
      updateApiStatus('✅ Data loaded successfully', 'green');
      document.getElementById('errorBox').classList.add('hidden');
    } else {
      updateApiStatus('🔄 City not found', 'red');
      showErrorMessage();
      hideWeatherSections();
    }
  } catch (error) {
    console.error(error);
    updateApiStatus('❌ Network error', 'red');
    showErrorMessage();
    hideWeatherSections();
  }
}

function displayWeather(data) {
  document.getElementById('weatherCard').classList.remove('hidden');
  document.getElementById('sunTempSection').classList.remove('hidden');
  document.getElementById('additionalData').classList.remove('hidden');

  document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('currentDate').textContent = new Date().toLocaleString();
  document.getElementById('coordinates').textContent = `Lat: ${data.coord.lat}°, Lon: ${data.coord.lon}°`;

  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('feelsLike').textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
  document.getElementById('description').textContent = capitalize(data.weather[0].description);
  document.getElementById('weatherIcon').textContent = getWeatherIcon(data.weather[0].main);

  document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

  document.getElementById('sunrise').textContent = unixToTime(data.sys.sunrise);
  document.getElementById('sunset').textContent = unixToTime(data.sys.sunset);
  document.getElementById('minTemp').textContent = `${data.main.temp_min}°C`;
  document.getElementById('maxTemp').textContent = `${data.main.temp_max}°C`;

  document.getElementById('windDirection').textContent = `${data.wind.deg}°`;
  document.getElementById('cloudiness').textContent = `${data.clouds.all}%`;
  document.getElementById('seaLevel').textContent = data.main.sea_level ? `${data.main.sea_level} hPa` : 'N/A';
  document.getElementById('groundLevel').textContent = data.main.grnd_level ? `${data.main.grnd_level} hPa` : 'N/A';
  document.getElementById('tempRange').textContent = `${data.main.temp_min}° to ${data.main.temp_max}°`;
  document.getElementById('dataTime').textContent = new Date(data.dt * 1000).toLocaleTimeString();
}

function updateApiStatus(message, color) {
  const status = document.getElementById('apiStatus');
  status.textContent = message;
  status.style.backgroundColor = {
    green: 'rgba(0,255,0,0.2)',
    yellow: 'rgba(255,255,0,0.2)',
    red: 'rgba(255,0,0,0.2)'
  }[color] || 'transparent';
}

function hideWeatherSections() {
  document.getElementById('weatherCard').classList.add('hidden');
  document.getElementById('sunTempSection').classList.add('hidden');
  document.getElementById('additionalData').classList.add('hidden');
}

function showErrorMessage() {
  const errorBox = document.getElementById('errorBox');
  errorBox.classList.remove('hidden');
}

function getWeatherIcon(type) {
  const icons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Smoke: '🌫️',
    Haze: '🌫️',
    Dust: '🌫️',
    Fog: '🌫️',
    Sand: '🌫️',
    Ash: '🌋',
    Squall: '💨',
    Tornado: '🌪️'
  };
  return icons[type] || '🌤️';
}

function unixToTime(unix) {
  return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
