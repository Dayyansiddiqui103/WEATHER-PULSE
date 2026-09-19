import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocationResult, WeatherData, UnitSettings } from '../types/weather';
import { formatTemp } from '../utils/units';
import { MapPin } from 'lucide-react';

// Custom Leaflet Pin Icon fix for React
const customIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `
    <div className="relative flex items-center justify-center">
      <div className="absolute w-8 h-8 bg-brand-500/40 rounded-full animate-ping"></div>
      <div className="w-9 h-9 bg-gradient-to-tr from-brand-600 to-sky-400 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white font-bold">
        ⚡
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// Map View Controller to re-center when location changes
function MapRecenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 9, { duration: 1.5 });
  }, [lat, lon, map]);
  return null;
}

interface WeatherMapProps {
  location: LocationResult;
  weatherData?: WeatherData | null;
  units: UnitSettings;
}

export const WeatherMap: React.FC<WeatherMapProps> = ({
  location,
  weatherData,
  units
}) => {
  const [activeLayer, setActiveLayer] = useState<'standard' | 'clouds'>('standard');

  const { latitude, longitude, name, country } = location;

  const getTileUrl = () => {
    if (activeLayer === 'clouds') {
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
    return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl space-y-4 border border-slate-200/60 dark:border-white/10 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Interactive Weather Map
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current radar focus: {name}, {country} ({latitude.toFixed(2)}°, {longitude.toFixed(2)}°)
          </p>
        </div>

        {/* Map Layer Selectors */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveLayer('standard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'standard'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Terrain Map
          </button>
          <button
            onClick={() => setActiveLayer('clouds')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'clouds'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Satellite View
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800 shadow-inner">
        <MapContainer
          center={[latitude, longitude]}
          zoom={9}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={getTileUrl()}
          />

          <MapRecenter lat={latitude} lon={longitude} />

          <Marker position={[latitude, longitude]} icon={customIcon}>
            <Popup className="weather-map-popup">
              <div className="p-1 text-slate-900 font-sans">
                <div className="font-bold text-sm">{name}</div>
                {weatherData && (
                  <div className="text-xs font-semibold text-brand-600 mt-0.5">
                    {formatTemp(weatherData.current.temperature, units.temp)} • {weatherData.current.conditionText}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Map Floating Info Badge */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs flex items-center gap-2 shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-semibold text-slate-900 dark:text-white">Live Location Feed Active</span>
        </div>
      </div>
    </div>
  );
};
