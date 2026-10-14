export function hasUsableWeatherData(data) {
  return Boolean(data?.current && Array.isArray(data?.daily?.time) && data.daily.time.length > 0);
}
