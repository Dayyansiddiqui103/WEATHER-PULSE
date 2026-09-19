# WeatherPulse ⚡

> Live Weather Forecast & Atmospheric Insights Web Application.

**WeatherPulse** is a production-quality, responsive weather web application built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Recharts**, and **Leaflet Maps**. Powered by real-time meteorological feeds, WeatherPulse delivers hourly forecasts, weekly outlooks, severe weather alerts, Air Quality Index (AQI) analysis, and interactive weather maps with dynamic atmospheric visual effects.

---

## ✨ Features

- 🌤️ **Current Weather Focus**: Large temperature scale, condition badges, feels-like temperatures, today's high/low, and last updated time.
- 🎨 **Dynamic Weather Atmosphere**: Visual background effects (Clear Sky, Clouds, Rain, Snow, Thunderstorm, Night) tailored to active conditions with `prefers-reduced-motion` support.
- 📈 **24-Hour Interactive Forecast**: Smooth temperature area charts powered by **Recharts**, with hourly precipitation probabilities.
- 📅 **7-Day Weekly Outlook**: Detailed daily forecast cards with expandable metrics (UV Index, Max Wind, Rain accumulation, Sun cycle).
- 📊 **Weather Analytics**: Tabbed interactive charts for Temperature trends, Precipitation probability, and Wind speed.
- 🗺️ **Interactive Weather Map**: Centered Leaflet map with pulsing location pins, popup insights, and terrain/satellite layer controls.
- 💨 **Air Quality Index (AQI)**: Numerical AQI gauge meter, health risk categories (Good to Hazardous), and pollutant breakdown (PM2.5, PM10, CO, NO₂, O₃, SO₂).
- 🚨 **Severe Weather Advisories**: Real-time alerts for high wind gusts and thunderstorms with safety directives.
- 🔍 **City Search & Geolocation**: Fast debounced city search autocomplete and browser geolocation with reverse geocoding.
- ⚙️ **Global Unit System**: Seamlessly switch units for Temperature (°C / °F), Wind (km/h, mph, m/s), Visibility (km / mi), and Pressure (hPa / inHg).
- 🌙 **Dark & Light Mode**: Intentionally designed dual-theme support with system preference detection.
- 🔖 **Saved Favorites**: Bookmark favorite locations for quick one-click access, persisted in LocalStorage.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Charts**: [Recharts](https://recharts.org/)
- **Maps**: [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/)
- **Data Provider**: [Open-Meteo API](https://open-meteo.com/) *(Free open-access WMO satellite weather & geocoding feeds — no API key required)*

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0 or higher
- `npm` or `yarn` or `pnpm`

### Installation

1. **Clone or navigate to project directory**:
   ```bash
   cd "Weather app"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your web browser.

---

## 🔑 Environment Variables (Optional)

WeatherPulse works out-of-the-box using Open-Meteo open weather services without requiring an API key.

If you wish to configure optional secondary weather tile providers or custom API proxies, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Example `.env`:
```env
VITE_OPENWEATHER_API_KEY=your_key_here
VITE_WEATHER_MAP_KEY=your_map_key_here
```

---

## 📁 Project Structure

```text
Weather app/
├── public/
├── src/
│   ├── components/
│   │   ├── AirQualityCard.tsx      # AQI meter & pollutant metrics
│   │   ├── CurrentWeatherDetails.tsx# Humidity, wind compass, UV, pressure grid
│   │   ├── CurrentWeatherHero.tsx   # Hero display & dynamic background
│   │   ├── ErrorState.tsx          # User friendly error screen
│   │   ├── Header.tsx              # Search autocomplete, geolocation, theme/unit toggles
│   │   ├── HourlyForecast.tsx      # 24-hour interactive Recharts area curve
│   │   ├── LoadingSkeleton.tsx     # Animated pulse placeholders
│   │   ├── MobileNav.tsx           # Mobile slide-out navigation drawer
│   │   ├── SavedLocations.tsx      # Favorited cities grid
│   │   ├── SettingsModal.tsx       # Unit preference & theme drawer
│   │   ├── Sidebar.tsx             # Desktop side navigation bar
│   │   ├── WeatherAlerts.tsx       # Severe weather notices
│   │   ├── WeatherAnalytics.tsx    # Tabbed temperature, precipitation & wind charts
│   │   ├── WeatherAtmosphere.tsx   # Particle canvas visual effects
│   │   ├── WeatherMap.tsx          # Leaflet map & layer toggles
│   │   └── WeeklyForecast.tsx      # 7-day expandable forecast cards
│   ├── services/
│   │   └── weatherApi.ts           # Open-Meteo fetcher, geocoding & caching layer
│   ├── types/
│   │   └── weather.ts              # TypeScript models & data interfaces
│   ├── utils/
│   │   ├── storage.ts              # LocalStorage helpers for favorites & units
│   │   ├── units.ts                # °C/°F, wind, visibility & pressure converters
│   │   └── weatherIcons.ts         # Weather code maps to Lucide icons & gradients
│   ├── App.tsx                     # Main application layout coordinator
│   ├── index.css                   # Tailwind directives & glassmorphic utilities
│   └── main.tsx                    # React entry point
├── index.html                      # HTML document shell with font & map stylesheets
├── package.json                    # Project scripts and dependencies
├── tailwind.config.js              # Tailwind custom colors & keyframe animations
├── tsconfig.json                   # TypeScript compiler options
└── vite.config.ts                  # Vite server & bundler configuration
```

---

## 📜 Build for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
