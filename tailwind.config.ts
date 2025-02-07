/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vibrantPink: '#D83F87',
        darkPurple: '#2A1B3C',
        deepBlue: '#44318D',
        warmCoral: '#E98074',
        mutedGrayBlue: '#A4B3B6',
      },
    },
  },
  plugins: [],
}
