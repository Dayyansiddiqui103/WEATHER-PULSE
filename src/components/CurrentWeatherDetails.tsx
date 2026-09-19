import React from 'react';
import {
  Droplets,
  Wind,
  Compass,
  Eye,
  Gauge,
  SunMedium,
  Sunrise,
  Sunset
} from 'lucide-react';
import { CurrentWeather, UnitSettings } from '../types/weather';
import {
  formatWind,
  formatVisibility,
  formatPressure,
  getWindDirectionCardinal
} from '../utils/units';

interface CurrentWeatherDetailsProps {
  current: CurrentWeather;
  units: UnitSettings;
}

export const CurrentWeatherDetails: React.FC<CurrentWeatherDetailsProps> = ({
  current,
  units
}) => {
  const windCardinal = getWindDirectionCardinal(current.windDirection);

  // UV Category calculation
  const getUvCategory = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'text-emerald-600 dark:text-emerald-400' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-amber-600 dark:text-amber-400' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-600 dark:text-orange-400' };
    if (uv <= 10) return { label: 'Very High', color: 'text-rose-600 dark:text-rose-500' };
    return { label: 'Extreme', color: 'text-purple-600 dark:text-purple-400' };
  };

  const uvInfo = getUvCategory(current.uvIndex);

  // Humidity status
  const getHumidityStatus = (h: number) => {
    if (h < 30) return 'Dry atmosphere';
    if (h <= 60) return 'Comfortable level';
    if (h <= 80) return 'Humid conditions';
    return 'Very humid';
  };

  const cards = [
    {
      id: 'humidity',
      label: 'Humidity',
      icon: Droplets,
      iconColor: 'text-sky-500 dark:text-sky-400',
      value: `${current.humidity}%`,
      subText: getHumidityStatus(current.humidity)
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      icon: Wind,
      iconColor: 'text-teal-500 dark:text-teal-400',
      value: formatWind(current.windSpeed, units.wind),
      subText: `Gusts up to ${formatWind(current.windGust, units.wind)}`
    },
    {
      id: 'windDirection',
      label: 'Wind Direction',
      icon: Compass,
      iconColor: 'text-indigo-500 dark:text-indigo-400',
      value: `${windCardinal} (${current.windDirection}°)`,
      subText: 'Real-time vector',
      compassDeg: current.windDirection
    },
    {
      id: 'uv',
      label: 'UV Index',
      icon: SunMedium,
      iconColor: 'text-amber-500 dark:text-amber-400',
      value: `${current.uvIndex}`,
      subText: uvInfo.label,
      subColor: uvInfo.color
    },
    {
      id: 'visibility',
      label: 'Visibility',
      icon: Eye,
      iconColor: 'text-cyan-500 dark:text-cyan-400',
      value: formatVisibility(current.visibility, units.visibility),
      subText: current.visibility >= 10 ? 'Clear visibility' : 'Hazy / Low visibility'
    },
    {
      id: 'pressure',
      label: 'Pressure',
      icon: Gauge,
      iconColor: 'text-purple-500 dark:text-purple-400',
      value: formatPressure(current.pressure, units.pressure),
      subText: current.pressure > 1013 ? 'High pressure' : 'Low pressure'
    },
    {
      id: 'sunrise',
      label: 'Sunrise',
      icon: Sunrise,
      iconColor: 'text-amber-500 dark:text-amber-300',
      value: current.sunrise,
      subText: 'Dawn'
    },
    {
      id: 'sunset',
      label: 'Sunset',
      icon: Sunset,
      iconColor: 'text-orange-500 dark:text-orange-400',
      value: current.sunset,
      subText: 'Dusk'
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Current Conditions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="glass-panel glass-panel-hover p-4 rounded-2xl flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{card.label}</span>
                <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 ${card.iconColor}`}>
                  <Icon
                    className="w-4 h-4"
                    style={card.compassDeg !== undefined ? { transform: `rotate(${card.compassDeg}deg)` } : undefined}
                  />
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </div>
                <div className={`text-[11px] font-medium mt-0.5 ${card.subColor || 'text-slate-500 dark:text-slate-400'}`}>
                  {card.subText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
