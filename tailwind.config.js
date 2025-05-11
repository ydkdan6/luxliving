/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff9eb',
          100: '#feefc6',
          200: '#fcd47a',
          300: '#fcbe41',
          400: '#fba91a',
          500: '#e58b07',
          600: '#bc6506',
          700: '#964509',
          800: '#7b370d',
          900: '#66300f',
          950: '#3e190a',
        },
        secondary: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#1f1f1f',
        },
        cream: {
          50: '#fdfcf8',
          100: '#f8f5e9',
          200: '#f2ecda',
          300: '#e4d9b9',
          400: '#d4bf92',
          500: '#c9ad78',
          600: '#bd9660',
          700: '#a07c4e',
          800: '#826543',
          900: '#6b533a',
          950: '#352a1c',
        },
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};