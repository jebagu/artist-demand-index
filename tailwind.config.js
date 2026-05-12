/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      colors: {
        ink: "#080A0F",
        panel: "#11151E",
        panel2: "#171D28",
        line: "#273142",
        mint: "#49D3A8",
        amber: "#F2B84B",
        coral: "#FF7A70",
        sky: "#6BA7FF"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 18px 60px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};
