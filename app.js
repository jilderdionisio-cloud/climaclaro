import { getForecast, searchLocations } from './weather-api.js';
import { formatMetric } from './weather-format.js';

const form = document.querySelector('#weather-form');
const cityInput = document.querySelector('#city-input');
const locationButton = document.querySelector('#location-button');
const statusMessage = document.querySelector('#status-message');
const matchesSection = document.querySelector('#matches-section');
const matchesList = document.querySelector('#matches-list');
const results = document.querySelector('#weather-results');

const setStatus = (message) => { statusMessage.textContent = message; };
const formatPlace = (place) => [place.name, place.admin1, place.country].filter(Boolean).join(', ');

function renderMatches(places) {
  matchesList.replaceChildren();
  places.forEach((place) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const name = document.createElement('strong');
    const details = document.createElement('span');
    button.type = 'button';
    button.className = 'match-button';
    name.textContent = place.name;
    details.textContent = [place.admin1 || 'Región no disponible', place.country || 'País no disponible'].join(', ');
    button.append(name, details);
    button.addEventListener('click', () => loadWeather(place.latitude, place.longitude, formatPlace(place)));
    item.append(button);
    matchesList.append(item);
  });
  matchesSection.hidden = false;
  matchesList.querySelector('button')?.focus();
}

function renderForecast(data) {
  const forecastList = document.querySelector('#forecast-list');
  forecastList.replaceChildren();
  data.daily.time.forEach((date, index) => {
    const card = document.createElement('article');
    const title = document.createElement('h3');
    const temperatures = document.createElement('p');
    const precipitation = document.createElement('span');
    title.textContent = index === 0 ? 'Hoy' : new Intl.DateTimeFormat('es-MX', { weekday: 'long' }).format(new Date(`${date}T12:00:00`));
    temperatures.textContent = `${formatMetric(data.daily.temperature_2m_max[index], data.daily_units.temperature_2m_max)} / ${formatMetric(data.daily.temperature_2m_min[index], data.daily_units.temperature_2m_min)}`;
    precipitation.textContent = `Probabilidad de precipitación: ${formatMetric(data.daily.precipitation_probability_max[index], data.daily_units.precipitation_probability_max)}`;
    card.className = 'forecast-day';
    card.append(title, temperatures, precipitation);
    forecastList.append(card);
  });
}

function renderWeather(data, place) {
  const { current, current_units: units } = data;
  document.querySelector('#results-title').textContent = place;
  document.querySelector('#updated-at').textContent = `Actualizado: ${current.time}`;
  document.querySelector('#temperature').textContent = formatMetric(current.temperature_2m, units.temperature_2m);
  document.querySelector('#weather-description').textContent = 'Temperatura a 2 metros';
  document.querySelector('#feels-like').textContent = 'Datos meteorológicos actuales';
  document.querySelector('#humidity').textContent = formatMetric(current.relative_humidity_2m, units.relative_humidity_2m);
  document.querySelector('#wind').textContent = formatMetric(current.wind_speed_10m, ` ${units.wind_speed_10m}`);
  document.querySelector('#wind-direction').textContent = 'Velocidad a 10 metros';
  renderForecast(data);
  results.hidden = false;
}

async function loadWeather(latitude, longitude, place) {
  matchesSection.hidden = true;
  setStatus(`Consultando el clima de ${place}…`);
  try {
    const data = await getForecast(latitude, longitude);
    renderWeather(data, place);
    setStatus(`Clima de ${place} cargado desde Open-Meteo.`);
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) { setStatus(error.message); }
}

async function searchCity(city) {
  if (!city) { setStatus('Escribe el nombre de una ciudad antes de buscar.'); cityInput.focus(); return; }
  results.hidden = true;
  matchesSection.hidden = true;
  setStatus('Buscando coincidencias…');
  try {
    const data = await searchLocations(city);
    if (!data.results?.length) throw new Error('No encontramos coincidencias. Prueba con otro nombre de ciudad.');
    renderMatches(data.results);
    const count = data.results.length;
    setStatus(`${count} coincidencia${count === 1 ? '' : 's'} encontrada${count === 1 ? '' : 's'}. Elige una ubicación.`);
  } catch (error) { setStatus(error.message); }
}

form.addEventListener('submit', (event) => { event.preventDefault(); searchCity(cityInput.value.trim()); });
locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) { setStatus('Tu navegador no admite geolocalización. Busca una ciudad para continuar.'); return; }
  setStatus('Solicitando tu ubicación…');
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => loadWeather(coords.latitude, coords.longitude, 'Tu ubicación actual'),
    () => setStatus('No pudimos acceder a tu ubicación. Busca una ciudad para continuar.'),
    { enableHighAccuracy: false, timeout: 10000 }
  );
});
