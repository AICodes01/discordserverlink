import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          blurple: "#5865F2",
          hover: "#4752C4",
          green: "#57F287",
          yellow: "#FEE75C",
          fuchsia: "#EB459E",
          red: "#ED4245",
          dark: "#0F1117",
          card: "#161822",
          cardHover: "#1C1F2D",
          border: "#252837",
          subtle: "#313548",
          textMuted: "#949BA4",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(88, 101, 242, 0.4)",
        "glow-sm": "0 0 15px -3px rgba(88, 101, 242, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
