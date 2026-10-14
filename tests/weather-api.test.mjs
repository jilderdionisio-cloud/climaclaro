import assert from 'node:assert/strict';
import test from 'node:test';
import { getForecast, searchLocations } from '../weather-api.js';
import { formatMetric } from '../weather-format.js';
import { hasUsableWeatherData } from '../weather-data.js';

const response = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

test('la búsqueda configura name, count=5 y language=es', async () => {
  let requestUrl;
  await searchLocations('Mérida', async (url) => { requestUrl = new URL(url); return response(200, { results: [] }); });
  assert.equal(requestUrl.searchParams.get('name'), 'Mérida');
  assert.equal(requestUrl.searchParams.get('count'), '5');
  assert.equal(requestUrl.searchParams.get('language'), 'es');
});

test('el pronóstico configura las variables y tres días solicitados', async () => {
  let requestUrl;
  await getForecast(-12.04, -77.03, async (url) => { requestUrl = new URL(url); return response(200, {}); });
  assert.equal(requestUrl.searchParams.get('current'), 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,is_day,wind_speed_10m,wind_direction_10m');
  assert.equal(requestUrl.searchParams.get('daily'), 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max');
  assert.equal(requestUrl.searchParams.get('timezone'), 'auto');
  assert.equal(requestUrl.searchParams.get('forecast_days'), '3');
});

test('simulación: identifica HTTP 429', async () => {
  await assert.rejects(() => searchLocations('Lima', async () => response(429, {})), /límite temporal/);
});

test('simulación: identifica error 5xx del servicio', async () => {
  await assert.rejects(() => getForecast(0, 0, async () => response(503, {})), /servicio meteorológico no está disponible/);
});

test('simulación: identifica falta de conexión', async () => {
  await assert.rejects(() => searchLocations('Lima', async () => { throw new TypeError('Failed to fetch'); }), /No hay conexión disponible/);
});

test('simulación: identifica una consulta cancelada por tiempo de espera', async () => {
  await assert.rejects(() => getForecast(20, -89, async () => { const error = new Error('aborted'); error.name = 'AbortError'; throw error; }), /tardó demasiado/);
});

test('los valores meteorológicos cero se conservan', () => {
  assert.equal(formatMetric(0, '°C'), '0°C');
  assert.equal(formatMetric(0, '%'), '0%');
  assert.equal(formatMetric(0, ' km/h'), '0 km/h');
});

test('los datos meteorológicos ausentes son explícitos', () => {
  assert.equal(formatMetric(undefined, '°C'), 'No disponible');
  assert.equal(formatMetric(null, '%'), 'No disponible');
});

test('una respuesta meteorológica incompleta no se considera utilizable', () => {
  assert.equal(hasUsableWeatherData({ current: {} }), false);
  assert.equal(hasUsableWeatherData({ daily: { time: [] } }), false);
  assert.equal(hasUsableWeatherData({ current: {}, daily: { time: ['2026-10-14'] } }), true);
});
