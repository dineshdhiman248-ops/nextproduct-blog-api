import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        ink: "var(--color-ink)",
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        gold: "var(--color-gold)",
        muted: "var(--color-muted)",
        surface: "var(--color-surface)",
        line: "var(--color-line)"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "rise-in": "rise-in 0.7s cubic-bezier(0.16,1,0.3,1) both"
      }
    }
  },
  plugins: []
};
export default config;
