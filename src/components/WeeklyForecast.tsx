import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Droplet, Sun, Wind, Eye } from 'lucide-react';
import { DailyItem, UnitSettings } from '../types/weather';
import { formatTemp, formatWind } from '../utils/units';
import { getWeatherCodeInfo } from '../utils/weatherIcons';

interface WeeklyForecastProps {
  daily: DailyItem[];
  units: UnitSettings;
}

export const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ daily, units }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Compute temperature range scale across week for progress bars
  const allMax = Math.max(...daily.map((d) => d.tempMax));
  const allMin = Math.min(...daily.map((d) => d.tempMin));
  const tempRange = Math.max(1, allMax - allMin);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl space-y-4 border border-slate-200/60 dark:border-white/10">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">7-Day Outlook</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">Click a day for details</span>
      </div>

      <div className="space-y-2.5">
        {daily.map((item, idx) => {
          const info = getWeatherCodeInfo(item.weatherCode, true);
          const Icon = info.icon;
          const isExpanded = expandedIndex === idx;

          // Bar calculations
          const leftPercent = Math.max(0, Math.min(100, ((item.tempMin - allMin) / tempRange) * 100));
          const widthPercent = Math.max(10, Math.min(100 - leftPercent, ((item.tempMax - item.tempMin) / tempRange) * 100));

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-white/90 dark:bg-slate-900/90 border-brand-500/40 shadow-xl'
                  : 'bg-white/50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 hover:bg-white/80 dark:hover:bg-slate-800/50'
              }`}
            >
              {/* Row Banner */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left"
              >
                {/* Day & Icon */}
                <div className="flex items-center gap-3 w-32 sm:w-40 shrink-0">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-brand-600 dark:text-brand-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{item.dayName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.conditionText}</div>
                  </div>
                </div>

                {/* Rain Probability Badge */}
                <div className="hidden sm:flex items-center gap-1 w-20 shrink-0 text-xs font-semibold text-sky-600 dark:text-sky-400">
                  {item.precipitationProbability > 0 ? (
                    <>
                      <Droplet className="w-3.5 h-3.5 fill-sky-500 dark:fill-sky-400" />
                      <span>{item.precipitationProbability}%</span>
                    </>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">0% rain</span>
                  )}
                </div>

                {/* Temperature Progress Bar */}
                <div className="flex-1 flex items-center gap-3 max-w-xs">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-10 text-right">
                    {formatTemp(item.tempMin, units.temp)}
                  </span>

                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 rounded-full"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-slate-900 dark:text-white w-10">
                    {formatTemp(item.tempMax, units.temp)}
                  </span>
                </div>

                {/* Expand Toggle Chevron */}
                <div className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded Details Drawer */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Max UV</span>
                      <span className="font-bold text-slate-900 dark:text-white">{item.uvIndexMax} Index</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <Wind className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Max Wind</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formatWind(item.windSpeedMax, units.wind)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <Droplet className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Rain Accumulation</span>
                      <span className="font-bold text-slate-900 dark:text-white">{item.rainSum} mm</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <Eye className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Sun Cycle</span>
                      <span className="font-bold text-slate-900 dark:text-white">{item.sunrise} - {item.sunset}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
