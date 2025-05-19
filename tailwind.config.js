/** @type {import('tailwindcss').Config} */
const rtl = require('tailwindcss-rtl');
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // تمام فایل‌های js، jsx، ts و tsx در فولدر src
  ],

  theme: {
    extend: {
      fontFamily: {
        krona: ['"Krona One"', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      },
    },
  },
  plugins: [rtl],
}


