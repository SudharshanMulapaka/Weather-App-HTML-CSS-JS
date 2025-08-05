const VC_API_KEY = 'JRHNUS8NDB5UDXPXMUMKNZ4P3';
const OWM_API_KEY = 'b43c2f0b6a03f3554f66db559704d7fe';
function handleKeyPress(e) {
  if (e.key === 'Enter') searchWeather();
}
async function searchWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const date = document.getElementById('dateInput').value;
  if (!city) return alert('Please enter a city name.');
  updateStatus('Fetching data...', 'yellow');
  document.getElementById('errorBox').classList.add('hidden');
  if (date) {
    await fetchHistoryWeather(city, date);
  } else {
    await fetchLiveWeather(city);
  }
}
async function fetchLiveWeather(city) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OWM_API_KEY}&units=metric`);
    const data = await res.json();
    if (!res.ok) return handleError();
    showWeather(data, true);
  } catch {
    handleError();
  }
}
async function fetchHistoryWeather(city, date) {
  const encodedCity = encodeURIComponent(city);
  try {
    const res = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedCity}/${date}?key=${VC_API_KEY}&unitGroup=metric`);
    const data = await res.json();
    if (!res.ok || !data.days || !data.days[0]) return handleError();
    showWeather(data.days[0], false, data.resolvedAddress);
  } catch {
    handleError();
  }
}
function showWeather(data, isLive, cityNameOverride = '') {
  document.getElementById('weatherCard').classList.remove('hidden');
  const oldSection = document.getElementById('sunTempSection');
  if (oldSection) oldSection.remove();
  const section = document.createElement('div');
  section.id = 'sunTempSection';
  section.className = 'sun-temp-section';
  section.innerHTML = `
    <div class="info-block"><p>🌅 Sunrise</p><h3>${isLive ? formatUnix(data.sys.sunrise) : data.sunrise}</h3></div>
    <div class="info-block"><p>🌇 Sunset</p><h3>${isLive ? formatUnix(data.sys.sunset) : data.sunset}</h3></div>
    <div class="info-block"><p>🌡️ Min Temp</p><h3>${isLive ? data.main.temp_min : data.tempmin}°C</h3></div>
    <div class="info-block"><p>🌡️ Max Temp</p><h3>${isLive ? data.main.temp_max : data.tempmax}°C</h3></div>
  `;
  document.querySelector('.container').insertBefore(section, document.querySelector('.footer'));
  document.getElementById('cityName').textContent = isLive ? `${data.name}, ${data.sys.country}` : cityNameOverride;
  document.getElementById('currentDate').textContent = isLive ? new Date().toLocaleString() : data.datetime;
  document.getElementById('coordinates').textContent = isLive ? `Lat: ${data.coord.lat}, Lon: ${data.coord.lon}` : '';
  document.getElementById('temperature').textContent = `${Math.round(isLive ? data.main.temp : data.temp)}°C`;
  document.getElementById('feelsLike').textContent = isLive ? `Feels like ${Math.round(data.main.feels_like)}°C` : '';
  document.getElementById('description').textContent = isLive ? capitalize(data.weather[0].description) : data.conditions;
  document.getElementById('weatherIcon').textContent = getIcon(isLive ? data.weather[0].main : data.icon);
  document.getElementById('windSpeed').textContent = `${isLive ? data.wind.speed : data.windspeed} m/s`;
  document.getElementById('humidity').textContent = `${isLive ? data.main.humidity : data.humidity}%`;
  document.getElementById('visibility').textContent = isLive ? `${(data.visibility / 1000).toFixed(1)} km` : 'N/A';
  document.getElementById('pressure').textContent = isLive ? `${data.main.pressure} hPa` : `${data.pressure} hPa`;
  updateStatus('✅ Data loaded successfully', 'green');
}
function handleError() {
  updateStatus('❌ Failed to fetch data', 'red');
  document.getElementById('weatherCard').classList.add('hidden');
  document.getElementById('errorBox').classList.remove('hidden');
  const sun = document.getElementById('sunTempSection');
  if (sun) sun.remove();
}
function updateStatus(msg, color) {
  const el = document.getElementById('apiStatus');
  el.textContent = msg;
  el.style.backgroundColor = {
    green: 'rgba(0,255,0,0.2)',
    yellow: 'rgba(255,255,0,0.2)',
    red: 'rgba(255,0,0,0.2)'
  }[color];
}
function formatUnix(unix) {
  return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function getIcon(type) {
  const icons = {
    Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️',
    Snow: '❄️', Mist: '🌫️', Smoke: '🌫️', Haze: '🌫️', Dust: '🌫️',
    Fog: '🌫️', Sand: '🌫️', Ash: '🌋', Squall: '💨', Tornado: '🌪️',
    'partly-cloudy-day': '🌤️', 'partly-cloudy-night': '🌥️',
    'clear-day': '☀️', 'clear-night': '🌙', 'rain': '🌧️', 'snow': '❄️',
    'cloudy': '☁️'
  };
  return icons[type] || '🌈';
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
