/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        default: ["Urbanist", "sans-serif"],
        accent: ["Urbanist", "sans-serif"],
      },
    },
  },
  plugins: [],
}
