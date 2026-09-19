import React from 'react';
import { Wind, ShieldAlert, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { AirQualityData } from '../types/weather';

interface AirQualityCardProps {
  airQuality: AirQualityData;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  const { aqi, aqiCategory, pm25, pm10, co, no2, o3, so2 } = airQuality;

  // Category styling and health info
  const getCategoryTheme = (cat: AirQualityData['aqiCategory']) => {
    switch (cat) {
      case 'Good':
        return {
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
          bar: 'bg-emerald-500',
          icon: CheckCircle2,
          advice: 'Air quality is satisfactory. Enjoy outdoor activities.'
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-400',
          bar: 'bg-amber-500',
          icon: AlertTriangle,
          advice: 'Acceptable air quality. Unusually sensitive people should limit prolonged outdoor exertion.'
        };
      case 'Unhealthy for Sensitive Groups':
        return {
          bg: 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/30 text-orange-700 dark:text-orange-400',
          bar: 'bg-orange-500',
          icon: ShieldAlert,
          advice: 'Sensitive groups may experience health effects. General public less likely affected.'
        };
      case 'Unhealthy':
        return {
          bg: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30 text-rose-700 dark:text-rose-400',
          bar: 'bg-rose-500',
          icon: ShieldAlert,
          advice: 'Everyone may begin to experience health effects. Reduce heavy outdoor exertion.'
        };
      case 'Very Unhealthy':
      case 'Hazardous':
        return {
          bg: 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/30 text-purple-700 dark:text-purple-400',
          bar: 'bg-purple-500',
          icon: AlertOctagon,
          advice: 'Health warnings of emergency conditions. Avoid all outdoor activities.'
        };
    }
  };

  const theme = getCategoryTheme(aqiCategory);
  const Icon = theme.icon;

  const aqiPercent = Math.min(100, Math.max(0, (aqi / 300) * 100));

  const pollutants = [
    { name: 'PM2.5', label: 'Fine Particles', val: `${pm25} µg/m³`, status: pm25 < 12 ? 'Good' : 'Elevated' },
    { name: 'PM10', label: 'Coarse Particles', val: `${pm10} µg/m³`, status: pm10 < 54 ? 'Good' : 'Elevated' },
    { name: 'O₃', label: 'Ozone', val: `${o3} µg/m³`, status: o3 < 70 ? 'Good' : 'Elevated' },
    { name: 'NO₂', label: 'Nitrogen Dioxide', val: `${no2} µg/m³`, status: no2 < 53 ? 'Good' : 'Elevated' },
    { name: 'CO', label: 'Carbon Monoxide', val: `${co} µg/m³`, status: 'Normal' },
    { name: 'SO₂', label: 'Sulfur Dioxide', val: `${so2} µg/m³`, status: 'Normal' }
  ];

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl space-y-5 border border-slate-200/60 dark:border-white/10">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          Air Quality Index (AQI)
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${theme.bg}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{aqiCategory}</span>
        </div>
      </div>

      {/* Main AQI Score & Meter Bar */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">{aqi}</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">US AQI Score</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs text-right hidden sm:block">
            {theme.advice}
          </p>
        </div>

        {/* Meter Gauge Bar */}
        <div className="relative h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${theme.bar}`}
            style={{ width: `${aqiPercent}%` }}
          />
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 sm:hidden">{theme.advice}</p>
      </div>

      {/* Pollutants Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        {pollutants.map((p) => (
          <div key={p.name} className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-brand-600 dark:text-brand-300">{p.name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{p.status}</span>
            </div>
            <div className="mt-2">
              <div className="text-sm font-bold text-slate-900 dark:text-white">{p.val}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{p.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
