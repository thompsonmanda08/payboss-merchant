/** @type {import('tailwindcss').Config} */

const headlessuiPlugin = require('@headlessui/tailwindcss')
const formsPlugin = require('@tailwindcss/forms')
const tailwindAnimate = require('tailwindcss-animate')

const { nextui } = require('@nextui-org/theme')
export const darkMode = ['class']
export const content = [
  './src/**/*.{js,jsx,ts,tsx}',
  './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
]
export const prefix = ''
export const theme = {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px',
    },
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.5rem' }],
    base: ['1rem', { lineHeight: '1.75rem' }],
    lg: ['1.125rem', { lineHeight: '2rem' }],
    xl: ['1.25rem', { lineHeight: '2rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['2rem', { lineHeight: '2.5rem' }],
    '4xl': ['2.5rem', { lineHeight: '3.5rem' }],
    '5xl': ['3rem', { lineHeight: '3.5rem' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1.1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },
  extend: {
    maxWidth: {
      '2xl': '40rem',
    },
    fontFamily: {
      inter: 'var(--font-inter)',
      display: 'var(--font-lexend)',
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
        400: '#c031e2',
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
    keyframes: {
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
  },
}

export const plugins = [
  tailwindAnimate,
  headlessuiPlugin,
  formsPlugin,
  nextui({
    addCommonColors: true,
  }),
]
