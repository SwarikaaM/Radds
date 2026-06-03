/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#22568F",
        secondary: "#2389AF",
        dark: "#0D1B2E",
        lightbg: "#F4F8FC",
        surface: "#FFFFFF",
        textprimary: "#0D1B2E",
        textmuted: "#6B7E99",
        accent: "#39C3EF",
        success: "#1DB954",
        warning: "#F5A623",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        dm: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
        input: "4px",
      },
    },
  },
  plugins: [],
};
