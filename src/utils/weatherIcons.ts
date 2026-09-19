import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
  LucideIcon
} from 'lucide-react';

export type AtmosphereType = 'clear' | 'clouds' | 'rain' | 'snow' | 'storm' | 'fog' | 'night';

export interface WeatherCodeInfo {
  label: string;
  icon: LucideIcon;
  atmosphere: AtmosphereType;
  gradientDark: string;
  gradientLight: string;
}

export function getWeatherCodeInfo(code: number, isDay: boolean = true): WeatherCodeInfo {
  // Clear sky
  if (code === 0) {
    if (!isDay) {
      return {
        label: 'Clear Night',
        icon: Moon,
        atmosphere: 'night',
        gradientDark: 'from-indigo-950 via-slate-900 to-slate-950',
        gradientLight: 'from-indigo-100 via-sky-100 to-slate-100'
      };
    }
    return {
      label: 'Clear Sky',
      icon: Sun,
      atmosphere: 'clear',
      gradientDark: 'from-amber-950/40 via-sky-950/60 to-slate-950',
      gradientLight: 'from-amber-100/60 via-sky-100 to-sky-50'
    };
  }

  // Mainly clear / Partly cloudy
  if (code === 1 || code === 2) {
    if (!isDay) {
      return {
        label: 'Partly Cloudy',
        icon: CloudMoon,
        atmosphere: 'night',
        gradientDark: 'from-slate-900 via-indigo-950/50 to-slate-950',
        gradientLight: 'from-slate-200 via-sky-100 to-indigo-50'
      };
    }
    return {
      label: 'Partly Cloudy',
      icon: CloudSun,
      atmosphere: 'clouds',
      gradientDark: 'from-sky-950/60 via-slate-900 to-slate-950',
      gradientLight: 'from-sky-200 via-slate-100 to-slate-50'
    };
  }

  // Overcast
  if (code === 3) {
    return {
      label: 'Overcast',
      icon: Cloud,
      atmosphere: 'clouds',
      gradientDark: 'from-slate-900 via-gray-900 to-slate-950',
      gradientLight: 'from-slate-300 via-slate-200 to-slate-100'
    };
  }

  // Fog
  if (code === 45 || code === 48) {
    return {
      label: 'Foggy',
      icon: CloudFog,
      atmosphere: 'fog',
      gradientDark: 'from-slate-900 via-slate-800 to-slate-950',
      gradientLight: 'from-slate-200 via-gray-200 to-slate-100'
    };
  }

  // Drizzle
  if (code >= 51 && code <= 57) {
    return {
      label: 'Light Drizzle',
      icon: CloudDrizzle,
      atmosphere: 'rain',
      gradientDark: 'from-blue-950/70 via-slate-900 to-slate-950',
      gradientLight: 'from-blue-200 via-sky-100 to-slate-100'
    };
  }

  // Rain / Rain Showers
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      label: code >= 65 || code === 82 ? 'Heavy Rain' : 'Rainy',
      icon: CloudRain,
      atmosphere: 'rain',
      gradientDark: 'from-blue-950 via-slate-900 to-slate-950',
      gradientLight: 'from-blue-200 via-slate-200 to-blue-50'
    };
  }

  // Snow / Snow Showers
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return {
      label: 'Snowfall',
      icon: CloudSnow,
      atmosphere: 'snow',
      gradientDark: 'from-sky-950 via-indigo-950/40 to-slate-950',
      gradientLight: 'from-sky-100 via-blue-50 to-slate-100'
    };
  }

  // Thunderstorm
  if (code >= 95 && code <= 99) {
    return {
      label: 'Thunderstorm',
      icon: CloudLightning,
      atmosphere: 'storm',
      gradientDark: 'from-indigo-950 via-purple-950/50 to-slate-950',
      gradientLight: 'from-purple-200 via-slate-200 to-indigo-100'
    };
  }

  // Default fallback
  return {
    label: 'Partly Cloudy',
    icon: CloudSun,
    atmosphere: 'clouds',
    gradientDark: 'from-slate-900 via-slate-950 to-slate-950',
    gradientLight: 'from-slate-200 via-slate-100 to-slate-50'
  };
}
