/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        themeBlack: '#0a0a0a',
        themeWhite: '#fdfdfd',
        accentBlue: '#2563eb',
        accentGreen: '#16a34a',
        accentBlueHover: '#1d4ed8',
        accentGreenHover: '#15803d',
        monochrome: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(10, 10, 10, 1)',
        'brutal-sm': '2px 2px 0px 0px rgba(10, 10, 10, 1)',
        'brutal-hover': '6px 6px 0px 0px rgba(10, 10, 10, 1)',
      }
    },
  },
  plugins: [],
};
