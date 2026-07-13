/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Swap these to match the exact Figma palette once you have it
        navy: {
          50: "#EEF2F7",
          100: "#D4DEEA",
          400: "#3A5A82",
          600: "#1E3A5F",
          700: "#16304F",
          900: "#0D1B2A",
        },
        teal: {
          400: "#2DD4BF",
          500: "#14B8A6",
        },
        surface: "#F7F8FA",
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
