import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#6236FF",
          lightPurple: "#825EFF",
          darkPurple: "#4A1BD6",
        },
      },
      fontFamily: {
        sans: ["Trap", "Montserrat", "sans-serif"],
        trap: ["Trap", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
