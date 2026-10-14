const form = document.querySelector('#weather-form');
const cityInput = document.querySelector('#city-input');
const locationButton = document.querySelector('#location-button');
const statusMessage = document.querySelector('#status-message');
const card = document.querySelector('#weather-card');

const weatherCodes = { 0: ['Despejado', '☀️'], 1: ['Principalmente despejado', '🌤️'], 2: ['Parcialmente nublado', '⛅'], 3: ['Nublado', '☁️'], 45: ['Niebla', '🌫️'], 48: ['Niebla con escarcha', '🌫️'], 51: ['Llovizna ligera', '🌦️'], 53: ['Llovizna', '🌦️'], 55: ['Llovizna intensa', '🌧️'], 61: ['Lluvia ligera', '🌦️'], 63: ['Lluvia', '🌧️'], 65: ['Lluvia intensa', '🌧️'], 71: ['Nevada ligera', '🌨️'], 73: ['Nevada', '🌨️'], 75: ['Nevada intensa', '❄️'], 80: ['Chubascos ligeros', '🌦️'], 81: ['Chubascos', '🌧️'], 82: ['Chubascos intensos', '⛈️'], 95: ['Tormenta', '⛈️'], 96: ['Tormenta con granizo', '⛈️'], 99: ['Tormenta fuerte con granizo', '⛈️'] };

function setStatus(message) { statusMessage.textContent = message; }
function showWeather(data, place) {
  const current = data.current;
  const [description, icon] = weatherCodes[current.weather_code] || ['Condiciones variables', '🌤️'];
  document.querySelector('#place-name').textContent = place;
  document.querySelector('#weather-description').textContent = description;
  document.querySelector('#temperature').textContent = `${Math.round(current.temperature_2m)}°`;
  document.querySelector('#feels-like').textContent = `Sensación térmica de ${Math.round(current.apparent_temperature)}°`;
  document.querySelector('#weather-icon').textContent = icon;
  document.querySelector('#humidity').textContent = `${current.relative_humidity_2m}%`;
  document.querySelector('#wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  document.querySelector('#precipitation').textContent = `${current.precipitation} mm`;
  card.hidden = false;
}
async function loadWeather(latitude, longitude, place) {
  setStatus('Consultando el clima…');
  try {
    const params = new URLSearchParams({ latitude, longitude, current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m', wind_speed_unit: 'kmh', timezone: 'auto' });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error('No fue posible consultar el pronóstico.');
    showWeather(await response.json(), place);
    setStatus('Información actualizada.');
  } catch (error) { setStatus(error.message); }
}
async function searchCity(city) {
  setStatus('Buscando ciudad…');
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`);
    const data = await response.json();
    const result = data.results?.[0];
    if (!result) throw new Error('No encontramos esa ciudad. Intenta con otra búsqueda.');
    const place = [result.name, result.admin1, result.country].filter(Boolean).join(', ');
    await loadWeather(result.latitude, result.longitude, place);
  } catch (error) { setStatus(error.message); }
}
form.addEventListener('submit', (event) => { event.preventDefault(); searchCity(cityInput.value.trim()); });
locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) return setStatus('Tu navegador no admite geolocalización.');
  setStatus('Solicitando tu ubicación…');
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => loadWeather(coords.latitude, coords.longitude, 'Tu ubicación'),
    () => setStatus('No pudimos acceder a tu ubicación. Busca una ciudad para continuar.'),
    { enableHighAccuracy: false, timeout: 10000 }
  );
});

searchCity('Ciudad de México');
