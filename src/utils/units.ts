import { TempUnit, WindUnit, VisibilityUnit, PressureUnit } from '../types/weather';

export function convertTemp(celsius: number, unit: TempUnit): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: TempUnit): string {
  const val = convertTemp(celsius, unit);
  return `${val}°${unit}`;
}

export function convertWind(kmh: number, unit: WindUnit): number {
  if (unit === 'mph') {
    return Math.round(kmh * 0.621371);
  }
  if (unit === 'ms') {
    return Math.round((kmh / 3.6) * 10) / 10;
  }
  return Math.round(kmh);
}

export function formatWind(kmh: number, unit: WindUnit): string {
  const val = convertWind(kmh, unit);
  const unitLabel = unit === 'kmh' ? 'km/h' : unit === 'mph' ? 'mph' : 'm/s';
  return `${val} ${unitLabel}`;
}

export function convertVisibility(km: number, unit: VisibilityUnit): number {
  if (unit === 'mi') {
    return Math.round(km * 0.621371 * 10) / 10;
  }
  return Math.round(km * 10) / 10;
}

export function formatVisibility(km: number, unit: VisibilityUnit): string {
  const val = convertVisibility(km, unit);
  const label = unit === 'mi' ? 'mi' : 'km';
  return `${val} ${label}`;
}

export function convertPressure(hpa: number, unit: PressureUnit): number {
  if (unit === 'inHg') {
    return Math.round(hpa * 0.02953 * 100) / 100;
  }
  return Math.round(hpa);
}

export function formatPressure(hpa: number, unit: PressureUnit): string {
  const val = convertPressure(hpa, unit);
  const label = unit === 'inHg' ? 'inHg' : 'hPa';
  return `${val} ${label}`;
}

export function getWindDirectionCardinal(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5);
  return directions[index % 16];
}
