const { preset } = require("./src/styles/shadcn");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...preset,
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
};
