import { heroui } from '@heroui/theme';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/components/(dropdown|menu|divider|popover|button|ripple|spinner).js',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: { foreground: '#E4E4E7', DEFAULT: '#ffffff' },

            foreground: '#11181C',
            primary: {
              foreground: '#FFFFFF',
              DEFAULT: '#9353d3',
            },
            secondary: {
              foreground: '#FFFFFF',
              DEFAULT: '#18181b',
            },
            warning: {
              foreground: '#006FEE',
              DEFAULT: '#18181b',
            },
            success: {
              foreground: '#FFFFFF',
              DEFAULT: '#5EC9A7',
            },
          },
        },
        dark: {
          colors: {
            background: { foreground: '#18181b', DEFAULT: '#131314' },
            foreground: '#ECEDEE',
            primary: {
              foreground: '#FFFFFF',
              DEFAULT: '#006FEE',
            },
            secondary: {
              foreground: '#FFFFFF',
              DEFAULT: '#A2E9C1',
            },
          },
        },
        mytheme: {
          extend: 'dark',
          colors: {
            primary: {
              DEFAULT: '#BEF264',
              foreground: '#000000',
            },
            focus: '#BEF264',
          },
        },
      },
    }),
  ],
} satisfies Config;
