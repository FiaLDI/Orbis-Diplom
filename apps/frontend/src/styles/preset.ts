// src/styles/preset.ts
// --------------------------------------------
// Tailwind 3.4-safe preset with 3 themes + plugins
// --------------------------------------------

import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";
import animate from "tailwindcss-animate";
import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

export const preset: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-foreground":
          "rgb(var(--color-primary-foreground) / <alpha-value>)",
      },
      

      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        roboto: ["var(--font-roboto)"],
        popins: ["poppins", "sans-serif"],
        sarpanch: ["sarpanch", "sans-serif"],
      },

      borderRadius: {
        lg: "var(--radius)",
      },

      boxShadow: {
        myShadow: "0 10px 15px -3px rgba(0,0,0,0.3)",
        glowing: "0 0 20px rgba(255,255,255,0.6)",
        deepBlue: "0 5px 15px rgba(0,0,255,0.4)",
      },

      backgroundImage: {
        "body-texture-black": "url('/img/backgroundbigblack.jpg')",
        "body-texture-standart": "url('/img/backgroundbigstandart.jpg')",
        "body-texture-light": "url('/img/backgroundbig.jpg')",
      },
    },
  },

  plugins: [
    typography,
    aspectRatio,
    animate,
    require("tailwindcss-textshadow"),
    plugin(function ({ addVariant }: PluginAPI) {
      addVariant("parent", "&>div");
    }),
  ],
};
