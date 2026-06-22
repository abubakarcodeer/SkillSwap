/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { 50:'#eef4ff',500:'#5b6cff',600:'#4651e0',700:'#3a42b8' },
      },
    },
  },
  plugins: [],
};
