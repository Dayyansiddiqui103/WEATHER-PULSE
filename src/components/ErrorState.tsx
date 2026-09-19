import React from 'react';
import { AlertCircle, RefreshCw, Search } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  onSearchFallback?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to connect to weather data services.',
  onRetry,
  onSearchFallback
}) => {
  return (
    <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-5 max-w-lg mx-auto my-12 border border-rose-500/20 bg-rose-950/10">
      <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">Weather Data Unavailable</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}

        {onSearchFallback && (
          <button
            onClick={onSearchFallback}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Search className="w-4 h-4 text-brand-400" />
            <span>Search Different City</span>
          </button>
        )}
      </div>
    </div>
  );
};
