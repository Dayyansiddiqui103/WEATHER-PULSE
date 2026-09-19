import React, { useEffect, useState } from 'react';
import { AtmosphereType } from '../utils/weatherIcons';

interface WeatherAtmosphereProps {
  atmosphere: AtmosphereType;
  isDay?: boolean;
}

export const WeatherAtmosphere: React.FC<WeatherAtmosphereProps> = ({ atmosphere, isDay = true }) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) {
    return null; // Render no dynamic particle overlays if reduced motion is requested
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-1000">
      {/* Clear Sky Sun Ray Glow */}
      {atmosphere === 'clear' && isDay && (
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse-subtle pointer-events-none" />
      )}

      {/* Rain Effect Drops */}
      {atmosphere === 'rain' && (
        <div className="absolute inset-0 opacity-25">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[1px] bg-gradient-to-b from-transparent via-blue-300 to-transparent rounded-full animate-rain-drop"
              style={{
                height: `${Math.random() * 30 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * -20}%`,
                animationDuration: `${0.6 + Math.random() * 0.6}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Snow Flakes */}
      {atmosphere === 'snow' && (
        <div className="absolute inset-0 opacity-40">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/80 rounded-full animate-float blur-[0.5px]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 5}s`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Cloud Atmospheric Drift */}
      {(atmosphere === 'clouds' || atmosphere === 'fog') && (
        <>
          <div className="absolute -top-10 left-1/4 w-72 h-72 bg-slate-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 -right-10 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </>
      )}

      {/* Storm Ambient Lightning Glow */}
      {atmosphere === 'storm' && (
        <div className="absolute inset-0 bg-indigo-500/5 animate-pulse-subtle" />
      )}

      {/* Night Sky Soft Stars Glow */}
      {(!isDay || atmosphere === 'night') && (
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-sky-100 rounded-full animate-pulse-subtle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
