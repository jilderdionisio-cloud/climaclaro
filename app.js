import { getForecast, searchLocations } from './weather-api.js';
import { formatMetric } from './weather-format.js';

const $ = (selector) => document.querySelector(selector);
const form = $('#weather-form'), input = $('#city-input'), status = $('#status-message'), matches = $('#matches-section'), list = $('#matches-list'), results = $('#weather-results'), content = $('#weather-content'), skeleton = $('#loading-skeleton'), retry = $('#retry-button'), searchButton = $('#search-button');
let activeController, lastAction, requestVersion = 0;
const conditions = { 0:['Despejado','☀️'],1:['Mayormente despejado','🌤️'],2:['Parcialmente nublado','⛅'],3:['Nublado','☁️'],45:['Niebla','🌫️'],48:['Niebla con escarcha','🌫️'],51:['Llovizna ligera','🌦️'],53:['Llovizna','🌦️'],55:['Llovizna intensa','🌧️'],61:['Lluvia ligera','🌦️'],63:['Lluvia','🌧️'],65:['Lluvia intensa','🌧️'],71:['Nieve ligera','🌨️'],73:['Nieve','🌨️'],75:['Nieve intensa','❄️'],80:['Chubascos ligeros','🌦️'],81:['Chubascos','🌧️'],82:['Chubascos intensos','⛈️'],95:['Tormenta','⛈️'] };
const formatPlace = (place) => [place.name, place.admin1, place.country].filter(Boolean).join(', ');
const setStatus = (message, canRetry = false) => { status.textContent = message; retry.hidden = !canRetry; };
function loading(isLoading) { results.setAttribute('aria-busy', String(isLoading)); skeleton.hidden = !isLoading; content.hidden = isLoading; searchButton.disabled = isLoading; }
function startRequest() { activeController?.abort(); activeController = new AbortController(); requestVersion += 1; return { signal: activeController.signal, version: requestVersion }; }
function weatherDetails(code) { return conditions[code] || ['Condiciones variables','🌤️']; }
function windLabel(degrees) { if (degrees === null || degrees === undefined) return 'Dirección no disponible'; return `${Math.round(degrees)}°`; }

function renderMatches(places) {
  list.replaceChildren();
  places.forEach((place) => { const item = document.createElement('li'), button = document.createElement('button'), name = document.createElement('strong'), details = document.createElement('span'); button.type='button'; button.className='match-button'; name.textContent=place.name; details.textContent=[place.admin1 || 'Región no disponible',place.country || 'País no disponible'].join(', '); button.append(name,details); button.addEventListener('click',()=>loadWeather(place.latitude,place.longitude,formatPlace(place))); item.append(button); list.append(item); });
  matches.hidden = false; list.querySelector('button')?.focus();
}
function renderForecast(data) {
  const forecast = $('#forecast-list'); forecast.replaceChildren();
  data.daily.time.forEach((date, index) => { const card=document.createElement('article'), day=document.createElement('h3'), icon=document.createElement('div'), temps=document.createElement('p'), rain=document.createElement('span'), [label,emoji]=weatherDetails(data.daily.weather_code[index]); card.className='forecast-day'; day.textContent=index===0?'Hoy':new Intl.DateTimeFormat('es-MX',{weekday:'long',day:'numeric',month:'short'}).format(new Date(`${date}T12:00:00`)); icon.className='forecast-icon'; icon.textContent=emoji; icon.setAttribute('aria-label',label); temps.textContent=`${formatMetric(data.daily.temperature_2m_max[index],data.daily_units.temperature_2m_max)} / ${formatMetric(data.daily.temperature_2m_min[index],data.daily_units.temperature_2m_min)}`; rain.textContent=`Lluvia: ${formatMetric(data.daily.precipitation_probability_max[index],data.daily_units.precipitation_probability_max)}`; card.append(day,icon,temps,rain); forecast.append(card); });
}
function renderWeather(data, place) {
  const current=data.current, units=data.current_units, [label,emoji]=weatherDetails(current.weather_code); document.body.dataset.theme=current.is_day?'day':'night'; $('#hero-icon').textContent=emoji; $('#current-icon').textContent=emoji; $('#location-label').textContent=place; $('#updated-at').textContent=`Actualizado ${new Intl.DateTimeFormat('es-MX',{dateStyle:'medium',timeStyle:'short'}).format(new Date(current.time))}`; $('#temperature').textContent=formatMetric(current.temperature_2m,units.temperature_2m); $('#weather-description').textContent=label; $('#humidity').textContent=formatMetric(current.relative_humidity_2m,units.relative_humidity_2m); $('#feels-like').textContent=formatMetric(current.apparent_temperature,units.apparent_temperature); $('#wind').textContent=formatMetric(current.wind_speed_10m,` ${units.wind_speed_10m}`); $('#wind-direction').textContent=windLabel(current.wind_direction_10m); $('#rain-chance').textContent=formatMetric(data.daily.precipitation_probability_max[0],data.daily_units.precipitation_probability_max); renderForecast(data); loading(false);
}
async function loadWeather(latitude, longitude, place) {
  matches.hidden=true; loading(true); setStatus(`Consultando el clima de ${place}…`); lastAction=()=>loadWeather(latitude,longitude,place); const {signal,version}=startRequest();
  try { const data=await getForecast(latitude,longitude,undefined,signal); if(version!==requestVersion) return; if(!data.current || !data.daily?.time?.length) throw new Error('La respuesta meteorológica llegó incompleta. Reintenta la consulta.'); renderWeather(data,place); setStatus(`Clima de ${place} actualizado.`); results.scrollIntoView({behavior:'smooth',block:'start'}); } catch(error) { if(version!==requestVersion) return; loading(false); setStatus(error.message,true); }
}
async function searchCity(city, selectFirst = false) {
  if(!city){setStatus('Escribe una ciudad antes de buscar.');input.focus();return;} matches.hidden=true; lastAction=()=>searchCity(city); setStatus('Buscando ciudades…'); const {signal,version}=startRequest();
  try { const data=await searchLocations(city,undefined,signal); if(version!==requestVersion)return; if(!data.results?.length)throw new Error('No encontramos esa ciudad. Prueba con el país o la región.'); if(selectFirst){const place=data.results[0]; loadWeather(place.latitude,place.longitude,formatPlace(place)); return;} renderMatches(data.results); setStatus(`Encontramos ${data.results.length} opciones. Elige una ubicación.`); } catch(error) { if(version!==requestVersion)return; setStatus(error.message,true); }
}
form.addEventListener('submit',(event)=>{event.preventDefault();searchCity(input.value.trim());}); retry.addEventListener('click',()=>lastAction?.()); $('#location-button').addEventListener('click',()=>{if(!navigator.geolocation){setStatus('Tu navegador no permite usar ubicación. Busca una ciudad manualmente.');return;}setStatus('Solicitando tu ubicación…');navigator.geolocation.getCurrentPosition(({coords})=>loadWeather(coords.latitude,coords.longitude,'Tu ubicación actual'),()=>setStatus('No pudimos usar tu ubicación. Busca una ciudad manualmente.',true),{timeout:10000,enableHighAccuracy:false});});

searchCity('Mérida, Yucatán', true);
