/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#D4BC94',
          400: '#C6A87D',
          500: '#B89566',
          700: '#A17B4F',
          900: '#8A6238'
        },
        secondary: {
          600: '#4A4A4A',
          700: '#333333',
          900: '#1A1A1A',
          950: '#121212'
        },
        cream: {
          50: '#FDFCFA',
          100: '#F5F5F0',
          300: '#E6E6E0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      }
    },
  },
  plugins: [],
};