export const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
export const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

function responseError(response, action) {
  if (response.status === 429) return new Error('Open-Meteo alcanzó su límite temporal. Espera un momento y vuelve a intentarlo.');
  if (response.status >= 500) return new Error(`El servicio meteorológico no está disponible para ${action}. Inténtalo más tarde.`);
  return new Error(`No fue posible ${action}.`);
}

async function requestJson(url, action, fetcher = fetch, signal) {
  try {
    const response = await fetcher(url, { signal });
    if (!response.ok) throw responseError(response, action);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('La consulta tardó demasiado. Reintenta la búsqueda.');
    if (error instanceof TypeError) throw new Error('No hay conexión disponible. Revisa tu red e inténtalo de nuevo.');
    throw error;
  }
}

export function searchLocations(name, fetcher, signal) {
  const params = new URLSearchParams({ name, count: '5', language: 'es' });
  return requestJson(`${GEOCODING_URL}?${params}`, 'realizar la búsqueda', fetcher, signal);
}

export function getForecast(latitude, longitude, fetcher, signal) {
  const params = new URLSearchParams({
    latitude, longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,is_day,wind_speed_10m,wind_direction_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto', forecast_days: '3'
  });
  return requestJson(`${FORECAST_URL}?${params}`, 'consultar el pronóstico', fetcher, signal);
}
