import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { HourlyItem, UnitSettings } from '../types/weather';
import { convertTemp, formatTemp } from '../utils/units';
import { getWeatherCodeInfo } from '../utils/weatherIcons';
import { Droplet } from 'lucide-react';

interface HourlyForecastProps {
  hourly: HourlyItem[];
  units: UnitSettings;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, units }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const chartData = hourly.map((item, idx) => ({
    time: item.time,
    temp: convertTemp(item.temperature, units.temp),
    rainProb: item.precipitationProbability,
    index: idx
  }));

  const selectedItem = hourly[selectedIndex] || hourly[0];

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl space-y-5 border border-slate-200/60 dark:border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Hourly Forecast</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Next 24 Hours outlook</p>
        </div>
        {selectedItem && (
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400">Selected Hour: </span>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-300">{selectedItem.time}</span>
          </div>
        )}
      </div>

      {/* Temperature Smooth Recharts Area Curve */}
      <div className="h-44 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38b0f8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38b0f8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 2', 'dataMax + 2']}
              unit={`°${units.temp}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white">{data.time}</div>
                      <div className="text-brand-600 dark:text-brand-300 font-extrabold">{data.temp}°{units.temp}</div>
                      <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Droplet className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                        <span>{data.rainProb}% Rain</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#0280c4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#tempGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Horizontally Scrollable Item Cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {hourly.map((item, idx) => {
          const info = getWeatherCodeInfo(item.weatherCode, true);
          const Icon = info.icon;
          const isSelected = selectedIndex === idx;

          return (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`shrink-0 flex flex-col items-center justify-between p-3 rounded-2xl w-20 border transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-brand-600 to-brand-700 text-white border-brand-400 shadow-lg shadow-brand-500/30 scale-105'
                  : 'bg-white/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                {idx === 0 ? 'Now' : item.time}
              </span>

              <Icon className={`w-6 h-6 my-2 ${isSelected ? 'text-white' : 'text-brand-600 dark:text-brand-300'}`} />

              <span className={`text-sm font-extrabold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {formatTemp(item.temperature, units.temp)}
              </span>

              {item.precipitationProbability > 0 ? (
                <div className={`flex items-center gap-0.5 text-[10px] font-semibold mt-1 ${isSelected ? 'text-sky-100' : 'text-sky-600 dark:text-sky-300'}`}>
                  <Droplet className="w-2.5 h-2.5 fill-current" />
                  <span>{item.precipitationProbability}%</span>
                </div>
              ) : (
                <div className="h-4" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
