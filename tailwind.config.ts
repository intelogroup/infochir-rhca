import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0c417b",
          foreground: "#ffffff",
          light: "#1565c0",
          dark: "#082b52",
        },
        secondary: {
          DEFAULT: "#41b06e",
          foreground: "#ffffff",
          light: "#4caf50",
        },
        muted: {
          DEFAULT: "#f8fafc",
          foreground: "#0c417b",
        },
        ocean: {
          DEFAULT: "#0EA5E9",
          hover: "#0C8BC7",
          light: "#38BDF8",
          dark: "#0369A1",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "shake": {
          "0%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(-10deg)",
          },
          "75%": {
            transform: "rotate(10deg)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;