import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Sun,
  Moon,
  Zap,
  Menu,
  X,
  Loader2,
  SlidersHorizontal
} from 'lucide-react';
import { LocationResult, UnitSettings, ThemeMode } from '../types/weather';
import { searchLocations } from '../services/weatherApi';

interface HeaderProps {
  currentLocation: LocationResult | null;
  onSelectLocation: (location: LocationResult) => void;
  onUseMyLocation: () => void;
  isLoadingLocation: boolean;
  units: UnitSettings;
  onToggleTempUnit: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  onUseMyLocation,
  isLoadingLocation,
  units,
  onToggleTempUnit,
  theme,
  onToggleTheme,
  onOpenSettings,
  onToggleMobileMenu,
  isMobileMenuOpen
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced Search Effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const searchRes = await searchLocations(query);
      setResults(searchRes);
      setIsSearching(false);
      setIsDropdownOpen(searchRes.length > 0);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationResult) => {
    onSelectLocation(loc);
    setQuery('');
    setIsDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800/60 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white">
                Weather<span className="text-brand-500 dark:text-brand-400">Pulse</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">Pro Weather</span>
            </div>
          </div>
        </div>

        {/* City Autocomplete Search Bar */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setIsDropdownOpen(true)}
              placeholder="Search city, country or region..."
              className="w-full pl-10 pr-10 py-2 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700/60 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-inner"
              aria-label="Search city location"
            />
            {isSearching ? (
              <Loader2 className="w-4 h-4 absolute right-3 animate-spin text-brand-500" />
            ) : query ? (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-800/60">
              {results.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-brand-500/10 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-brand-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {loc.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                    {loc.countryCode || 'LOC'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Use My Location Button */}
          <button
            onClick={onUseMyLocation}
            disabled={isLoadingLocation}
            title="Use current geolocation"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
            aria-label="Use current location"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
            ) : (
              <MapPin className="w-4 h-4 text-brand-500" />
            )}
            <span className="hidden lg:inline">My Location</span>
          </button>

          {/* °C / °F Switch */}
          <button
            onClick={onToggleTempUnit}
            title="Switch Temperature Unit"
            className="px-3 py-1.5 rounded-xl font-bold text-xs bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-all active:scale-95 shadow-sm"
          >
            °{units.temp}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title="Toggle Light / Dark Mode"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm"
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Open Preferences"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm"
            aria-label="Open settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
