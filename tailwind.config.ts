import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

/**
 * Rampa de marca (violeta). Una sola identidad para light y dark:
 * cambia el fondo, no el color de marca. Los tonos siguen una progresión
 * perceptual (50 claro → 900 oscuro) para que gráficas y acentos armonicen.
 */
const brand = {
  "50": "#F5F3FF",
  "100": "#EDE9FE",
  "200": "#DDD6FE",
  "300": "#C4B5FD",
  "400": "#A78BFA",
  "500": "#8B5CF6",
  "600": "#7C3AED",
  "700": "#6D28D9",
  "800": "#5B21B6",
  "900": "#4C1D95",
} as const;

// DEFAULT = 600: contraste AA (>4.5:1) con texto blanco en botones sólidos.
const primary = {
  ...brand,
  DEFAULT: "#7C3AED",
  foreground: "#FFFFFF",
};

// Colores semánticos compartidos entre temas.
const success = { DEFAULT: "#17C964", foreground: "#FFFFFF" };
const warning = { DEFAULT: "#F5A524", foreground: "#000000" };
const danger = { DEFAULT: "#F31260", foreground: "#FFFFFF" };
const focus = "#7C3AED";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(dropdown|menu|divider|popover|button|ripple|spinner).js",
  ],
  theme: {
    extend: {
      // `background` y `foreground` los provee HeroUI (con canales HSL para
      // soportar opacidad, p.ej. bg-background/80). `accent` es el pop ámbar
      // complementario que se usa en las cards de proyecto.
      colors: {
        accent: "#FACC15",
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: { DEFAULT: "#FFFFFF", foreground: "#F4F4F5" },
            foreground: "#18181B",
            primary,
            secondary: { DEFAULT: "#27272A", foreground: "#FFFFFF" },
            success,
            warning,
            danger,
            focus,
          },
        },
        dark: {
          colors: {
            background: { DEFAULT: "#0E0E11", foreground: "#18181B" },
            foreground: "#ECEDEE",
            primary,
            secondary: { DEFAULT: "#E4E4E7", foreground: "#18181B" },
            success,
            warning,
            danger,
            focus,
          },
        },
      },
    }),
  ],
} satisfies Config;
