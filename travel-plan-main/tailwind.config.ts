/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          fg: {
            base: "#f7f7f7",
            secondary: "#FF4CBE",
          },
          bg: {
            base: "#1E1E1E",
            secondary: "#f0f0f0",
          },
          purple: {
            "100": "#A9A1C4",
            "200": "#A097BE",
            "300": "#42307D",
            "400": "#2C2461",
            "500": "#280F63",
          },
          orange: {
            "100": "#FFE6CC",
            "200": "#FFCC99",
            "300": "#FFB266",
            "400": "#FF9933",
            "500": "#F58634",
            "700": "#d9541d",
          },

          gradient: {
            start: "#d9541d",
            end: "#3C1680",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      fontFamily: {
        nunito: ["nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
