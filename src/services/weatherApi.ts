import {
  WeatherData,
  LocationResult,
  CurrentWeather,
  HourlyItem,
  DailyItem,
  AirQualityData,
  WeatherAlert
} from '../types/weather';
import { getWeatherCodeInfo } from '../utils/weatherIcons';

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function searchLocations(query: string): Promise<LocationResult[]> {
  if (!query || query.trim().length < 2) return [];

  const cacheKey = `search_${query.toLowerCase().trim()}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding request failed');
    const data = await res.json();

    if (!data.results) return [];

    const results: LocationResult[] = data.results.map((item: any) => ({
      id: `${item.name.toLowerCase()}-${item.country_code?.toLowerCase() || item.id}`,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      timezone: item.timezone || 'auto'
    }));

    cache.set(cacheKey, { data: results, timestamp: Date.now() });
    return results;
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationResult> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const cityName = data.city || data.locality || data.principalSubdivision || 'Current Location';
      const countryName = data.countryName || '';
      return {
        id: `geo-${lat.toFixed(2)}-${lon.toFixed(2)}`,
        name: cityName,
        latitude: lat,
        longitude: lon,
        country: countryName,
        countryCode: data.countryCode || ''
      };
    }
  } catch (e) {
    console.warn('Reverse geocode fallback:', e);
  }

  return {
    id: `geo-${lat.toFixed(2)}-${lon.toFixed(2)}`,
    name: 'Current Location',
    latitude: lat,
    longitude: lon,
    country: ''
  };
}

export async function fetchWeatherData(location: LocationResult): Promise<WeatherData> {
  const { latitude: lat, longitude: lon } = location;
  const cacheKey = `weather_${lat.toFixed(3)}_${lon.toFixed(3)}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { ...cached.data, location };
  }

  try {
    // 1. Fetch Forecast Data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,surface_pressure,visibility,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
    
    // 2. Fetch Air Quality Data
    const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide&timezone=auto`;

    const [weatherRes, aqRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqUrl).catch(() => null)
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Weather API Error: ${weatherRes.statusText}`);
    }

    const wData = await weatherRes.json();
    const aqData = aqRes && aqRes.ok ? await aqRes.json() : null;

    // Normalize Current Weather
    const currentRaw = wData.current || {};
    const dailyRaw = wData.daily || {};
    const hourlyRaw = wData.hourly || {};

    const codeInfo = getWeatherCodeInfo(currentRaw.weather_code ?? 0, Boolean(currentRaw.is_day ?? 1));

    const todayHigh = dailyRaw.temperature_2m_max ? dailyRaw.temperature_2m_max[0] : currentRaw.temperature_2m;
    const todayLow = dailyRaw.temperature_2m_min ? dailyRaw.temperature_2m_min[0] : currentRaw.temperature_2m;
    const sunriseStr = dailyRaw.sunrise ? formatTime(dailyRaw.sunrise[0]) : '06:00 AM';
    const sunsetStr = dailyRaw.sunset ? formatTime(dailyRaw.sunset[0]) : '06:30 PM';

    const current: CurrentWeather = {
      temperature: currentRaw.temperature_2m ?? 20,
      feelsLike: currentRaw.apparent_temperature ?? currentRaw.temperature_2m ?? 20,
      tempMin: todayLow,
      tempMax: todayHigh,
      weatherCode: currentRaw.weather_code ?? 0,
      conditionText: codeInfo.label,
      isDay: Boolean(currentRaw.is_day ?? 1),
      humidity: currentRaw.relative_humidity_2m ?? 50,
      windSpeed: currentRaw.wind_speed_10m ?? 10,
      windDirection: currentRaw.wind_direction_10m ?? 0,
      windGust: currentRaw.wind_gusts_10m ?? currentRaw.wind_speed_10m ?? 10,
      pressure: Math.round(currentRaw.surface_pressure ?? 1013),
      visibility: hourlyRaw.visibility ? Math.round((hourlyRaw.visibility[0] || 10000) / 1000) : 10,
      uvIndex: dailyRaw.uv_index_max ? Math.round(dailyRaw.uv_index_max[0]) : 5,
      sunrise: sunriseStr,
      sunset: sunsetStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Normalize Hourly (Next 24 hours)
    const hourlyList: HourlyItem[] = [];
    const hourlyTimes = hourlyRaw.time || [];
    const now = new Date();
    
    // Find index corresponding to current hour
    let currentHourIndex = 0;
    for (let i = 0; i < hourlyTimes.length; i++) {
      if (new Date(hourlyTimes[i]) >= now) {
        currentHourIndex = Math.max(0, i - 1);
        break;
      }
    }

    for (let i = currentHourIndex; i < Math.min(hourlyTimes.length, currentHourIndex + 24); i++) {
      const timeISO = hourlyTimes[i];
      const d = new Date(timeISO);
      hourlyList.push({
        time: d.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        timestamp: d.getTime(),
        temperature: hourlyRaw.temperature_2m ? Math.round(hourlyRaw.temperature_2m[i]) : 20,
        weatherCode: hourlyRaw.weather_code ? hourlyRaw.weather_code[i] : 0,
        precipitationProbability: hourlyRaw.precipitation_probability ? hourlyRaw.precipitation_probability[i] || 0 : 0,
        rain: hourlyRaw.precipitation ? hourlyRaw.precipitation[i] || 0 : 0,
        windSpeed: hourlyRaw.wind_speed_10m ? hourlyRaw.wind_speed_10m[i] || 0 : 0,
        windDirection: hourlyRaw.wind_direction_10m ? hourlyRaw.wind_direction_10m[i] || 0 : 0,
        humidity: hourlyRaw.relative_humidity_2m ? hourlyRaw.relative_humidity_2m[i] || 50 : 50,
        uvIndex: hourlyRaw.uv_index ? Math.round(hourlyRaw.uv_index[i] || 0) : 0
      });
    }

    // Normalize Daily (7 Days)
    const dailyList: DailyItem[] = [];
    const dailyDates = dailyRaw.time || [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < Math.min(dailyDates.length, 7); i++) {
      const dateStr = dailyDates[i];
      const d = new Date(dateStr);
      const code = dailyRaw.weather_code ? dailyRaw.weather_code[i] : 0;
      const info = getWeatherCodeInfo(code, true);

      dailyList.push({
        date: dateStr,
        dayName: i === 0 ? 'Today' : dayNames[d.getDay()],
        weatherCode: code,
        conditionText: info.label,
        tempMax: dailyRaw.temperature_2m_max ? Math.round(dailyRaw.temperature_2m_max[i]) : 20,
        tempMin: dailyRaw.temperature_2m_min ? Math.round(dailyRaw.temperature_2m_min[i]) : 15,
        precipitationProbability: dailyRaw.precipitation_probability_max ? dailyRaw.precipitation_probability_max[i] || 0 : 0,
        rainSum: dailyRaw.precipitation_sum ? dailyRaw.precipitation_sum[i] || 0 : 0,
        windSpeedMax: dailyRaw.wind_speed_10m_max ? Math.round(dailyRaw.wind_speed_10m_max[i]) : 10,
        uvIndexMax: dailyRaw.uv_index_max ? Math.round(dailyRaw.uv_index_max[i]) : 5,
        sunrise: dailyRaw.sunrise ? formatTime(dailyRaw.sunrise[i]) : '06:00 AM',
        sunset: dailyRaw.sunset ? formatTime(dailyRaw.sunset[i]) : '06:30 PM',
        humidityAvg: 60
      });
    }

    // Normalize Air Quality
    const aqCurrent = aqData?.current || {};
    const usAqi = aqCurrent.us_aqi ? Math.round(aqCurrent.us_aqi) : calculateEstimateAqi(aqCurrent.pm2_5 || 12);
    
    let aqiCategory: AirQualityData['aqiCategory'] = 'Good';
    if (usAqi <= 50) aqiCategory = 'Good';
    else if (usAqi <= 100) aqiCategory = 'Moderate';
    else if (usAqi <= 150) aqiCategory = 'Unhealthy for Sensitive Groups';
    else if (usAqi <= 200) aqiCategory = 'Unhealthy';
    else if (usAqi <= 300) aqiCategory = 'Very Unhealthy';
    else aqiCategory = 'Hazardous';

    const airQuality: AirQualityData = {
      aqi: usAqi,
      aqiCategory,
      pm25: aqCurrent.pm2_5 ? Math.round(aqCurrent.pm2_5 * 10) / 10 : 12,
      pm10: aqCurrent.pm10 ? Math.round(aqCurrent.pm10 * 10) / 10 : 25,
      co: aqCurrent.carbon_monoxide ? Math.round(aqCurrent.carbon_monoxide) : 210,
      no2: aqCurrent.nitrogen_dioxide ? Math.round(aqCurrent.nitrogen_dioxide * 10) / 10 : 15,
      o3: aqCurrent.ozone ? Math.round(aqCurrent.ozone * 10) / 10 : 45,
      so2: aqCurrent.sulphur_dioxide ? Math.round(aqCurrent.sulphur_dioxide * 10) / 10 : 5
    };

    // Normalize Alerts (Check for extreme conditions in data)
    const alerts: WeatherAlert[] = [];
    if (current.windSpeed > 60) {
      alerts.push({
        id: `alert-wind-${Date.now()}`,
        event: 'High Wind Warning',
        severity: current.windSpeed > 80 ? 'extreme' : 'severe',
        affectedArea: location.name,
        onset: 'Immediate',
        expires: '24 Hours',
        description: `High wind gusts up to ${Math.round(current.windGust)} km/h detected in ${location.name}. Drive with caution and secure loose objects outdoors.`
      });
    }
    if (current.weatherCode >= 95) {
      alerts.push({
        id: `alert-storm-${Date.now()}`,
        event: 'Severe Thunderstorm Advisory',
        severity: 'severe',
        affectedArea: location.name,
        onset: 'Immediate',
        expires: '12 Hours',
        description: `Active thunderstorm systems with lightning hazards in ${location.name}. Stay indoors away from windows.`
      });
    }

    const normalized: WeatherData = {
      location,
      current,
      hourly: hourlyList,
      daily: dailyList,
      airQuality,
      alerts,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    cache.set(cacheKey, { data: normalized, timestamp: Date.now() });
    return normalized;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

function formatTime(isoStr: string): string {
  try {
    return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '06:00 AM';
  }
}

function calculateEstimateAqi(pm25: number): number {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round(50 + ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1));
  if (pm25 <= 55.4) return Math.round(101 + ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5));
  return 155;
}
