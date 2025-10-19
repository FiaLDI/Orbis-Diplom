// src/styles/preset.ts
// --------------------------------------------
// Tailwind 4 + TypeScript safe preset with 3 themes
// --------------------------------------------

// @ts-ignore — Tailwind 4 ESM modules
import plugin from "tailwindcss/plugin";
// @ts-ignore
import defaultTheme from "tailwindcss/defaultTheme";
// @ts-ignore
import colors from "tailwindcss/colors";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";
import animate from "tailwindcss-animate";
// @ts-ignore
import type { Config } from "tailwindcss";
// @ts-ignore
import type { PluginAPI } from "tailwindcss/types/config";

const shadcnPlugin = plugin(({ addBase }: any) => {
  addBase({
    ":root": {
      "--background": "0 0% 100%",
      "--foreground": "222.2 47.4% 11.2%",
      "--radius": "0.5rem",
      "--color-primary": "220 90% 56%",
      "--color-primary-foreground": "255 255% 100%",
    },
    ".theme-standart": {
      "--background": "0 0% 100%",
      "--foreground": "222.2 47.4% 11.2%",
      "--color-primary": "220 90% 56%",
      "--color-primary-foreground": "255 255% 100%",
    },
    ".theme-light": {
      "--background": "255 100% 95%",
      "--foreground": "222.2 47.4% 11.2%",
      "--color-primary": "210 80% 60%",
      "--color-primary-foreground": "0 0% 10%",
    },
    ".theme-dark": {
      "--background": "224 71% 4%",
      "--foreground": "213 31% 91%",
      "--color-primary": "213 90% 56%",
      "--color-primary-foreground": "255 255% 255%",
    },
    "*": { "@apply border-border": {} },
    body: { "@apply bg-background text-foreground": "" },
  });
});

export const preset: Config = {
  darkMode: ["class"],
  theme: {
    container: { center: true, padding: "2rem" },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--color-primary))",
        "primary-foreground": "hsl(var(--color-primary-foreground))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...(defaultTheme.fontFamily.sans as string[])],
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
        "body-texture": "url('/img/background.jpg')",
      },
    },
  },
  plugins: [
    typography,
    aspectRatio,
    animate,
    shadcnPlugin,
    require("tailwindcss-textshadow"),
    plugin(function ({ addVariant }: PluginAPI) {
      addVariant("parent", "&>div");
    }),
  ],
};
