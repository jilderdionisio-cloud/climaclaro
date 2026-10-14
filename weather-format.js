export function formatMetric(value, unit = '') {
  return `${new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(value)}${unit}`;
}
