import React from 'react';
import { Bookmark, BookmarkCheck, Clock, MapPin } from 'lucide-react';
import { WeatherData, UnitSettings } from '../types/weather';
import { formatTemp } from '../utils/units';
import { getWeatherCodeInfo } from '../utils/weatherIcons';
import { WeatherAtmosphere } from './WeatherAtmosphere';

interface CurrentWeatherHeroProps {
  data: WeatherData;
  units: UnitSettings;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  data,
  units,
  isFavorite,
  onToggleFavorite
}) => {
  const { location, current, lastUpdated } = data;
  const info = getWeatherCodeInfo(current.weatherCode, current.isDay);
  const Icon = info.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/60 dark:border-white/10 shadow-xl bg-gradient-to-br ${info.gradientLight} dark:${info.gradientDark} transition-all duration-700`}
    >
      {/* Weather Atmosphere Layer */}
      <WeatherAtmosphere atmosphere={info.atmosphere} isDay={current.isDay} />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        
        {/* Left Info Column */}
        <div className="space-y-4">
          {/* Location & Favorite Action */}
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300">
              <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {location.name}
              </h1>
              <span className="text-slate-600 dark:text-slate-400 font-medium text-lg">
                {location.country && `, ${location.country}`}
              </span>
            </div>

            <button
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from saved locations' : 'Save location'}
              className={`p-2.5 rounded-2xl border transition-all active:scale-95 ${
                isFavorite
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30'
                  : 'bg-white/60 dark:bg-white/10 border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80'
              }`}
            >
              {isFavorite ? (
                <BookmarkCheck className="w-5 h-5 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Condition Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/15 text-sm font-semibold text-slate-800 dark:text-white shadow-sm">
              <Icon className="w-4 h-4 text-brand-600 dark:text-brand-300" />
              <span>{current.conditionText}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated {lastUpdated}</span>
            </div>
          </div>

          {/* Temperature Typography Scale */}
          <div className="flex items-baseline gap-4 pt-2">
            <div className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
              {formatTemp(current.temperature, units.temp)}
            </div>
            
            <div className="flex flex-col text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
              <span className="text-slate-900 dark:text-slate-200 font-semibold">
                Feels like {formatTemp(current.feelsLike, units.temp)}
              </span>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mt-1">
                <span>H {formatTemp(current.tempMax, units.temp)}</span>
                <span>•</span>
                <span>L {formatTemp(current.tempMin, units.temp)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Icon Visual Focus */}
        <div className="flex items-center justify-center md:justify-end">
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
            <Icon className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 text-brand-600 dark:text-white drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)] animate-float" />
          </div>
        </div>

      </div>
    </div>
  );
};
