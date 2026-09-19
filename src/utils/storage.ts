import { LocationResult, UnitSettings, ThemeMode } from '../types/weather';

const FAVORITES_KEY = 'weatherpulse_favorites';
const UNITS_KEY = 'weatherpulse_units';
const THEME_KEY = 'weatherpulse_theme';
const LAST_LOCATION_KEY = 'weatherpulse_last_location';

export const DEFAULT_UNITS: UnitSettings = {
  temp: 'C',
  wind: 'kmh',
  visibility: 'km',
  pressure: 'hPa'
};

export const DEFAULT_LOCATIONS: LocationResult[] = [
  { id: 'karachi-pk', name: 'Karachi', latitude: 24.8607, longitude: 67.0011, country: 'Pakistan', countryCode: 'PK' },
  { id: 'london-gb', name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', countryCode: 'GB' },
  { id: 'tokyo-jp', name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', countryCode: 'JP' },
  { id: 'new-york-us', name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'United States', countryCode: 'US' },
  { id: 'dubai-ae', name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates', countryCode: 'AE' }
];

export function getSavedFavorites(): LocationResult[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return DEFAULT_LOCATIONS.slice(0, 4);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_LOCATIONS.slice(0, 4);
  } catch (e) {
    console.error('Failed to parse saved favorites:', e);
    return DEFAULT_LOCATIONS.slice(0, 4);
  }
}

export function saveFavoriteLocation(loc: LocationResult): LocationResult[] {
  const current = getSavedFavorites();
  const exists = current.some(item => item.name.toLowerCase() === loc.name.toLowerCase() && item.country.toLowerCase() === loc.country.toLowerCase());
  if (exists) return current;
  const updated = [loc, ...current];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFavoriteLocation(id: string): LocationResult[] {
  const current = getSavedFavorites();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export function isFavoriteLocation(loc: LocationResult, favorites: LocationResult[]): boolean {
  return favorites.some(item => item.name.toLowerCase() === loc.name.toLowerCase() && item.country.toLowerCase() === loc.country.toLowerCase());
}

export function getSavedUnits(): UnitSettings {
  try {
    const raw = localStorage.getItem(UNITS_KEY);
    if (!raw) return DEFAULT_UNITS;
    return { ...DEFAULT_UNITS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_UNITS;
  }
}

export function saveUnits(units: UnitSettings): void {
  localStorage.setItem(UNITS_KEY, JSON.stringify(units));
}

export function getSavedTheme(): ThemeMode {
  const raw = localStorage.getItem(THEME_KEY);
  if (raw === 'dark' || raw === 'light' || raw === 'system') return raw;
  return 'dark';
}

export function saveTheme(theme: ThemeMode): void {
  localStorage.setItem(THEME_KEY, theme);
}

export function getLastLocation(): LocationResult | null {
  try {
    const raw = localStorage.getItem(LAST_LOCATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveLastLocation(loc: LocationResult): void {
  localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(loc));
}
