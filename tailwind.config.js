/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#EAB308', // yellow-500
        secondary: '#4169E1', // Син цвят
        dark: '#000000', // Черен цвят
      },
    },
  },
  plugins: [],
}

module.exports = config
