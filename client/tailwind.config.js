/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f0ff',
          100: '#b3d4ff',
          500: '#1877F2',
          600: '#1565C0',
          700: '#0d47a1',
          900: '#061428',
        },
        accent: {
          400: '#e8893a',
          500: '#CC6600',
          600: '#b85a14',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}