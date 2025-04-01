/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#EAB308', 
        secondary: '#4169E1', 
        dark: '#000000', 
      },
    },
  },
  plugins: [],
}

module.exports = config
