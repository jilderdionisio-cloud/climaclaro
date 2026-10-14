export const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
export const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

function errorForResponse(response, action) {
  if (response.status === 429) return new Error('Open-Meteo está recibiendo demasiadas solicitudes. Espera un momento e inténtalo de nuevo.');
  if (response.status >= 500) return new Error(`El servicio meteorológico no está disponible para ${action}. Inténtalo más tarde.`);
  return new Error(`No fue posible ${action}.`);
}

async function requestJson(url, action, fetcher = fetch) {
  try {
    const response = await fetcher(url);
    if (!response.ok) throw errorForResponse(response, action);
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) throw new Error('No hay conexión disponible. Revisa tu red e inténtalo de nuevo.');
    throw error;
  }
}

export function searchLocations(name, fetcher) {
  const params = new URLSearchParams({ name, count: '5', language: 'es' });
  return requestJson(`${GEOCODING_URL}?${params}`, 'realizar la búsqueda', fetcher);
}

export function getForecast(latitude, longitude, fetcher) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '3'
  });
  return requestJson(`${FORECAST_URL}?${params}`, 'consultar el pronóstico', fetcher);
}
