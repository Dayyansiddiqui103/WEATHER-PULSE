import React from 'react';
import { AlertTriangle, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { WeatherAlert } from '../types/weather';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="glass-panel p-4 sm:p-5 rounded-3xl flex items-center justify-between border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Active Weather Alerts</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Meteorological safety parameters normal for this zone.</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 hidden sm:inline">
          Clear Conditions
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 animate-bounce" />
        Active Severe Weather Advisories ({alerts.length})
      </h3>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const isExtreme = alert.severity === 'extreme' || alert.severity === 'severe';
          return (
            <div
              key={alert.id}
              className={`p-5 rounded-3xl border shadow-xl transition-all space-y-3 ${
                isExtreme
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-500/60 text-slate-900 dark:text-white shadow-rose-500/10'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-500/50 text-slate-900 dark:text-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{alert.event}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500 dark:text-rose-400" /> {alert.affectedArea}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> Expires {alert.expires}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                    isExtreme
                      ? 'bg-rose-500/20 border-rose-400 text-rose-700 dark:text-rose-300'
                      : 'bg-amber-500/20 border-amber-400 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {alert.severity}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed pt-1 border-t border-slate-200 dark:border-white/10">
                {alert.description}
              </p>

              {alert.instruction && (
                <div className="text-xs bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-300 font-medium">
                  💡 Safety Directive: {alert.instruction}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
