/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fc',
          400: '#38b0f8',
          500: '#0ea0e6',
          600: '#0280c4',
          700: '#0366a1',
          800: '#075685',
          900: '#0c476e',
          950: '#082f4d',
        },
        weather: {
          sunny: '#f59e0b',
          cloudy: '#64748b',
          rainy: '#3b82f6',
          stormy: '#6366f1',
          snowy: '#38bdf8',
          night: '#1e1b4b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'rain-drop': 'rain 1s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        rain: {
          '0%': { transform: 'translateY(-100%)', opacity: '0.8' },
          '100%': { transform: 'translateY(1000%)', opacity: '0.1' },
        }
      }
    },
  },
  plugins: [],
}
