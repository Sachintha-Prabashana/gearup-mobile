/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
            primary: '#F4F6FB',
            brandBlue: '#4F86F7',
            brandBlueDark: '#3B6FD8',
            brandOrange: '#F7941D',
            card: '#FFFFFF',
            inputBg: '#F2F4F8',
            textPrimary: '#2E3440',
            textSecondary: '#8A8FA3',
        },
    },
  },
  plugins: [],
}