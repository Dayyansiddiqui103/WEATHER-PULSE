import React, { useState, useEffect, useCallback } from 'react';
import {
  LocationResult,
  WeatherData,
  UnitSettings,
  ThemeMode,
  AppView
} from './types/weather';
import { fetchWeatherData, reverseGeocode } from './services/weatherApi';
import {
  getSavedFavorites,
  saveFavoriteLocation,
  removeFavoriteLocation,
  isFavoriteLocation,
  getSavedUnits,
  saveUnits,
  getSavedTheme,
  saveTheme,
  getLastLocation,
  saveLastLocation,
  DEFAULT_LOCATIONS
} from './utils/storage';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { CurrentWeatherDetails } from './components/CurrentWeatherDetails';
import { HourlyForecast } from './components/HourlyForecast';
import { WeeklyForecast } from './components/WeeklyForecast';
import { WeatherAnalytics } from './components/WeatherAnalytics';
import { WeatherMap } from './components/WeatherMap';
import { AirQualityCard } from './components/AirQualityCard';
import { WeatherAlerts } from './components/WeatherAlerts';
import { SavedLocations } from './components/SavedLocations';
import { SettingsModal } from './components/SettingsModal';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorState } from './components/ErrorState';

export function App() {
  // State Initialization
  const [location, setLocation] = useState<LocationResult>(
    () => getLastLocation() || DEFAULT_LOCATIONS[0]
  );
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingGeo, setIsLoadingGeo] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [units, setUnits] = useState<UnitSettings>(getSavedUnits);
  const [theme, setTheme] = useState<ThemeMode>(getSavedTheme);
  const [favorites, setFavorites] = useState<LocationResult[]>(getSavedFavorites);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync Theme HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  // Load Weather Data for current location
  const loadWeather = useCallback(async (targetLoc: LocationResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(targetLoc);
      setWeatherData(data);
      saveLastLocation(targetLoc);
    } catch (err: any) {
      console.error('Weather load error:', err);
      setError('Unable to fetch live weather data. Please check network connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(location);
  }, [location, loadWeather]);

  // Geolocation Handler
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser geolocation is not supported on this device.');
      return;
    }

    setIsLoadingGeo(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const loc = await reverseGeocode(latitude, longitude);
          setLocation(loc);
        } catch (e) {
          setError('Failed to resolve current location details.');
        } finally {
          setIsLoadingGeo(false);
        }
      },
      (err) => {
        setIsLoadingGeo(false);
        alert(`Location permission denied or unavailable (${err.message}). Search for a city manually above.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Location Handlers
  const handleSelectLocation = (loc: LocationResult) => {
    setLocation(loc);
    if (currentView === 'saved') {
      setCurrentView('dashboard');
    }
  };

  const handleToggleFavorite = () => {
    const isFav = isFavoriteLocation(location, favorites);
    if (isFav) {
      const updated = removeFavoriteLocation(location.id);
      setFavorites(updated);
    } else {
      const updated = saveFavoriteLocation(location);
      setFavorites(updated);
    }
  };

  const handleRemoveFavorite = (id: string) => {
    const updated = removeFavoriteLocation(id);
    setFavorites(updated);
  };

  const handleToggleTempUnit = () => {
    const newUnits: UnitSettings = {
      ...units,
      temp: units.temp === 'C' ? 'F' : 'C'
    };
    setUnits(newUnits);
    saveUnits(newUnits);
  };

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const isCurrentFavorite = isFavoriteLocation(location, favorites);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white transition-colors duration-300">
      
      {/* Top Application Header */}
      <Header
        currentLocation={location}
        onSelectLocation={handleSelectLocation}
        onUseMyLocation={handleUseMyLocation}
        isLoadingLocation={isLoadingGeo}
        units={units}
        onToggleTempUnit={handleToggleTempUnit}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pt-16">
        
        {/* Desktop Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          savedCount={favorites.length}
        />

        {/* Mobile Navigation Drawer */}
        <MobileNav
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          currentView={currentView}
          onSelectView={setCurrentView}
          savedCount={favorites.length}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden min-w-0">
          
          {isLoading ? (
            <LoadingSkeleton />
          ) : error || !weatherData ? (
            <ErrorState
              message={error || 'No weather data returned.'}
              onRetry={() => loadWeather(location)}
              onSearchFallback={() => setLocation(DEFAULT_LOCATIONS[0])}
            />
          ) : (
            <>
              {/* Dynamic View Switcher */}
              {currentView === 'dashboard' && (
                <div className="space-y-6">
                  {/* Weather Hero Card */}
                  <CurrentWeatherHero
                    data={weatherData}
                    units={units}
                    isFavorite={isCurrentFavorite}
                    onToggleFavorite={handleToggleFavorite}
                  />

                  {/* Severe Weather Alerts Banner */}
                  <WeatherAlerts alerts={weatherData.alerts} />

                  {/* Current Weather Details Grid */}
                  <CurrentWeatherDetails
                    current={weatherData.current}
                    units={units}
                  />

                  {/* 24-Hour Hourly Forecast Curve */}
                  <HourlyForecast
                    hourly={weatherData.hourly}
                    units={units}
                  />

                  {/* 7-Day Weekly & Air Quality Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <WeeklyForecast
                      daily={weatherData.daily}
                      units={units}
                    />
                    <div className="space-y-6">
                      <AirQualityCard airQuality={weatherData.airQuality} />
                      <WeatherAnalytics hourly={weatherData.hourly} units={units} />
                    </div>
                  </div>

                  {/* Interactive Map View */}
                  <WeatherMap
                    location={location}
                    weatherData={weatherData}
                    units={units}
                  />
                </div>
              )}

              {currentView === 'forecast' && (
                <div className="space-y-6">
                  <WeeklyForecast daily={weatherData.daily} units={units} />
                  <HourlyForecast hourly={weatherData.hourly} units={units} />
                </div>
              )}

              {currentView === 'map' && (
                <div className="space-y-6">
                  <WeatherMap location={location} weatherData={weatherData} units={units} />
                </div>
              )}

              {currentView === 'airquality' && (
                <div className="space-y-6">
                  <AirQualityCard airQuality={weatherData.airQuality} />
                </div>
              )}

              {currentView === 'saved' && (
                <SavedLocations
                  favorites={favorites}
                  onSelectLocation={handleSelectLocation}
                  onRemoveFavorite={handleRemoveFavorite}
                  onOpenSearch={() => {
                    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (searchInput) searchInput.focus();
                  }}
                />
              )}

              {currentView === 'settings' && (
                <div className="glass-panel p-6 rounded-3xl max-w-xl mx-auto space-y-4">
                  <h3 className="text-lg font-bold text-white">Application Settings</h3>
                  <p className="text-xs text-slate-400">Manage display units, theme and cache below.</p>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
                  >
                    Open Settings Panel
                  </button>
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* Preferences Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        units={units}
        onChangeUnits={(u) => {
          setUnits(u);
          saveUnits(u);
        }}
        theme={theme}
        onChangeTheme={setTheme}
        onRefreshData={() => loadWeather(location)}
      />

    </div>
  );
}
