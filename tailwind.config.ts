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
              '50': '#212121',
              '100': '#ea2845',
              '200': '#092e20',
              '300': '#007acc',
              '400': '#C4841D',
              '500': '#f59e0b',
              '600': '#9333ea',
            },
            secondary: {
              foreground: '#FFFFFF',
              DEFAULT: '#18181b',
            },
            warning: {
              foreground: '#006FEE',
              DEFAULT: '#004493',
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
              '50': '#005BC4',
              '100': '#ff4c61',
              '200': '#1db954',
              '300': '#66b3ff',
              '400': '#FACC15',
              '500': '#FDBA74',
              '600': '#8f250b',
            },
            secondary: {
              foreground: '#FFFFFF',
              DEFAULT: '#A2E9C1',
            },
            warning: {
              foreground: '#006FEE',
              DEFAULT: '#09AACD',
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
