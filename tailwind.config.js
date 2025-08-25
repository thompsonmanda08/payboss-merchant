/** @type {import('tailwindcss').Config} */

// const formsPlugin = require("@tailwindcss/forms");
import tailwindAnimate from 'tailwindcss-animate';
import { heroui } from '@heroui/react';

export const darkMode = ['class'];
export const content = [
  './src/**/*.{js,jsx,ts,tsx}',
  './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  './node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}',
];
export const prefix = '';
export const theme = {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1440px',
    },
  },

  extend: {
    fontFamily: {
      inter: 'var(--font-inter)',
    },
    colors: {
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
        light: 'hsl(var(--primary-light))',
        50: '#f0f6ff',
        100: '#e1edff',
        200: '#bbd6ff',
        300: '#9DC4FF',
        400: '#3b81e1',
        500: '#1B64CE',
        600: '#175abc',
        700: '#1551a9',
        800: '#10438d',
        900: '#071e40',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
      '4xl': '2rem',
    },
  },
};

export const plugins = [
  tailwindAnimate,
  // formsPlugin,
  heroui({
    addCommonColors: true,
    themes: {
      light: {
        colors: {
          default: {
            DEFAULT: '#e7f1ff',
            foreground: '#4982d9',
          },
        },
      },
      dark: {
        colors: {
          default: {
            DEFAULT: '#0e1014',
            foreground: '#fcfcfc',
          },
        },
      },
    },
  }),
];
