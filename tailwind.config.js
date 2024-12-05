/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bigshot: ['"Bigshot One"', 'sans-serif'],
        fira: ['"Fira Code"', 'monospace'],
      },
      colors: {
        'butterfy': {
          dark: '#292222',
          light: '#EDE8DD',
          accent: '#1DB954',
        },
        darkBackground: "#292222",
        darkText: "#9098A3",
        offWhite: "#EDE8DD",
        spotifyGreen: "#1DB954",
      }
    },
  },
  plugins: [],
}