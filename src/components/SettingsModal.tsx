import React from 'react';
import { X, SlidersHorizontal, Thermometer, Wind, Eye, Gauge, Moon, RefreshCw } from 'lucide-react';
import { UnitSettings, ThemeMode } from '../types/weather';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: UnitSettings;
  onChangeUnits: (units: UnitSettings) => void;
  theme: ThemeMode;
  onChangeTheme: (theme: ThemeMode) => void;
  onRefreshData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  units,
  onChangeUnits,
  theme,
  onChangeTheme,
  onRefreshData
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 z-10 overflow-hidden text-slate-900 dark:text-white transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/20 dark:border-brand-500/30">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">WeatherPulse Preferences</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Customize display metrics and appearance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* Temperature Unit */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Temperature Unit
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeUnits({ ...units, temp: 'C' })}
                className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                  units.temp === 'C'
                    ? 'bg-brand-600 text-white border-brand-500 shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                onClick={() => onChangeUnits({ ...units, temp: 'F' })}
                className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                  units.temp === 'F'
                    ? 'bg-brand-600 text-white border-brand-500 shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Wind Speed Unit */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Wind Speed Unit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'kmh', label: 'km/h' },
                { id: 'mph', label: 'mph' },
                { id: 'ms', label: 'm/s' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChangeUnits({ ...units, wind: item.id as any })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    units.wind === item.id
                      ? 'bg-brand-600 text-white border-brand-500 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility Unit */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Visibility Unit
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeUnits({ ...units, visibility: 'km' })}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  units.visibility === 'km'
                    ? 'bg-brand-600 text-white border-brand-500'
                    : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Kilometers (km)
              </button>
              <button
                onClick={() => onChangeUnits({ ...units, visibility: 'mi' })}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  units.visibility === 'mi'
                    ? 'bg-brand-600 text-white border-brand-500'
                    : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Miles (mi)
              </button>
            </div>
          </div>

          {/* Pressure Unit */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Gauge className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Pressure Unit
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeUnits({ ...units, pressure: 'hPa' })}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  units.pressure === 'hPa'
                    ? 'bg-brand-600 text-white border-brand-500'
                    : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Hectopascals (hPa)
              </button>
              <button
                onClick={() => onChangeUnits({ ...units, pressure: 'inHg' })}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  units.pressure === 'inHg'
                    ? 'bg-brand-600 text-white border-brand-500'
                    : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Inches of Mercury (inHg)
              </button>
            </div>
          </div>

          {/* Theme Preference */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Interface Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dark', label: 'Dark Mode' },
                { id: 'light', label: 'Light Mode' },
                { id: 'system', label: 'System' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChangeTheme(item.id as ThemeMode)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    theme === item.id
                      ? 'bg-brand-600 text-white border-brand-500 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Force Refresh Button */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                onRefreshData();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              <RefreshCw className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Purge Cache & Force Refresh Weather</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
