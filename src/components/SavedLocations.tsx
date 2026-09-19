import React from 'react';
import { Bookmark, MapPin, Trash2, ArrowRight, Plus } from 'lucide-react';
import { LocationResult } from '../types/weather';

interface SavedLocationsProps {
  favorites: LocationResult[];
  onSelectLocation: (location: LocationResult) => void;
  onRemoveFavorite: (id: string) => void;
  onOpenSearch: () => void;
}

export const SavedLocations: React.FC<SavedLocationsProps> = ({
  favorites,
  onSelectLocation,
  onRemoveFavorite,
  onOpenSearch
}) => {
  if (favorites.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-3xl text-center space-y-4 max-w-md mx-auto my-12 border border-slate-200/60 dark:border-white/10">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto text-brand-600 dark:text-brand-400">
          <Bookmark className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Favorite Locations Saved</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search and bookmark your favorite cities for quick one-click access anywhere.
          </p>
        </div>
        <button
          onClick={onOpenSearch}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center gap-2 mx-auto shadow-lg shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Search & Add Location</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Saved Locations ({favorites.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Quickly launch weather dashboard for saved cities</p>
        </div>

        <button
          onClick={onOpenSearch}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Add Location</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((loc) => (
          <div
            key={loc.id}
            className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between border border-slate-200/60 dark:border-white/10 space-y-4 relative group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-brand-600 dark:text-brand-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{loc.name}</h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onRemoveFavorite(loc.id)}
                title="Remove location"
                className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
              </span>

              <button
                onClick={() => onSelectLocation(loc)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md group-hover:translate-x-0.5"
              >
                <span>View Weather</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
