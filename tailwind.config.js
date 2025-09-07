/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: { xs: "475px", xxs: "200px", ...defaultTheme.screens },

    fontSize: {
      xxs: ["0.625rem", { lineHeight: "0.75rem" }], // 10px
      xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
      sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
      base: ["1rem", { lineHeight: "1.5rem" }], // 16px
      lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
      xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
      "1.5xl": ["1.375rem", { lineHeight: "1.875rem" }], // 22px
      "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
      "2.5xl": ["1.75rem", { lineHeight: "2.25rem" }], // 28px
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
      "3.5xl": ["2rem", { lineHeight: "2.5rem" }], // 32px
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
      "4.5xl": ["2.5rem", { lineHeight: "2.75rem" }], // 40px
      "5xl": ["3rem", { lineHeight: "3.625rem" }], // 48px
      "6xl": ["3.875rem", { lineHeight: "1" }], // 62px
      "7xl": ["4.5rem", { lineHeight: "1" }], // 72px
      "8xl": ["6rem", { lineHeight: "1" }], // 96px
      "9xl": ["8rem", { lineHeight: "1" }], // 128px
    },
    extend: {
      colors: {
        brand: {
          theme: {
            DEFAULT: "#008080",
            500: "#008080",
            600: "#007373",
            800: "#004d4d",
          },
          gray: {
            DEFAULT: "#5e5e5f",
            300: "#F6F2F2",
            400: "#e5e7eb",
            500: "#5e5e5f",
          },
          blue: {
            700: "#07234a",
            800: "#051832",
            900: "#0d0d0d",
          },
          neutral: {
            DEFAULT: "#008080",
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
