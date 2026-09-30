/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        nba: {
          blue: "#1d428a",
          red: "#c8102e",
          gold: "#fdb927",
          court: "#e5a65e",
        },
      },
      fontFamily: {
        arcade: ["Chakra Petch", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
