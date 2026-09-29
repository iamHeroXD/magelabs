import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lab: {
          950: "#090a0c",
          900: "#0e1013",
          850: "#131519",
          800: "#181b21",
          700: "#242831",
          600: "#363c48",
          500: "#4f5767",
          400: "#808a9d",
          300: "#b0b8c6",
          200: "#dbe0ea",
          100: "#f1f3f7",
          50: "#f8f9fb",
        },
        amber: {
          400: "#f0a85d",
          500: "#d99b54",
          600: "#c08a4e",
          700: "#9e6f3b",
        },
        terminal: {
          red: "#ef4444",
          black: "#27272a",
          green: "#10b981",
          yellow: "#f59e0b",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
