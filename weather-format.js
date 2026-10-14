export function formatMetric(value, unit = '') {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return 'No disponible';
  return `${new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(value)}${unit}`;
}
