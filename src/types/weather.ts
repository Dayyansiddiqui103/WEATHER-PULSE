export type TempUnit = 'C' | 'F';
export type WindUnit = 'kmh' | 'mph' | 'ms';
export type VisibilityUnit = 'km' | 'mi';
export type PressureUnit = 'hPa' | 'inHg';

export interface UnitSettings {
  temp: TempUnit;
  wind: WindUnit;
  visibility: VisibilityUnit;
  pressure: PressureUnit;
}

export type ThemeMode = 'dark' | 'light' | 'system';
export type AppView = 'dashboard' | 'forecast' | 'map' | 'airquality' | 'saved' | 'settings';

export interface LocationResult {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number; // Celsius base
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  weatherCode: number;
  conditionText: string;
  isDay: boolean;
  humidity: number; // %
  windSpeed: number; // km/h base
  windDirection: number; // degrees
  windGust: number;
  pressure: number; // hPa
  visibility: number; // km
  uvIndex: number;
  sunrise: string;
  sunset: string;
  time: string;
}

export interface HourlyItem {
  time: string; // ISO or formatted
  timestamp: number;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number; // %
  rain: number; // mm
  windSpeed: number;
  windDirection: number;
  humidity: number;
  uvIndex: number;
}

export interface DailyItem {
  date: string; // YYYY-MM-DD
  dayName: string; // e.g. Mon, Tue
  weatherCode: number;
  conditionText: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  rainSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  humidityAvg: number;
}

export interface AirQualityData {
  aqi: number; // US AQI
  aqiCategory: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  co: number; // µg/m³
  no2: number; // µg/m³
  o3: number; // µg/m³
  so2: number; // µg/m³
}

export interface WeatherAlert {
  id: string;
  event: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  affectedArea: string;
  onset: string;
  expires: string;
  description: string;
  instruction?: string;
}

export interface WeatherData {
  location: LocationResult;
  current: CurrentWeather;
  hourly: HourlyItem[];
  daily: DailyItem[];
  airQuality: AirQualityData;
  alerts: WeatherAlert[];
  lastUpdated: string;
}
