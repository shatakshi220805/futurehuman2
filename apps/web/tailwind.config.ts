import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0F17",
        glass: "rgba(255,255,255,0.03)",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 80px rgba(52, 211, 153, 0.12)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        accordionDown: {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        accordionUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        accordionDown: "accordionDown 0.2s ease-out",
        accordionUp: "accordionUp 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
