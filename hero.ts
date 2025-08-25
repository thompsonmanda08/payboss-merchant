import { heroui } from '@heroui/react';

export default heroui({
  addCommonColors: true,
  defaultTheme: 'light',
  defaultExtendTheme: 'light',
  // layout: {
  //   disabledOpacity: "0.3",
  //   radius: {
  //     small: "4px",
  //     medium: "6px",
  //     large: "8px",
  //   },
  //   borderWidth: {
  //     small: "1px",
  //     medium: "2px",
  //     large: "3px",
  //   },
  // },
  themes: {
    light: {
      layout: {
        hoverOpacity: '0.8',
        // boxShadow: {
        //   small:
        //     '0px 0px 5px 0px rgb(0 0 0 / 0.02), 0px 2px 10px 0px rgb(0 0 0 / 0.06), 0px 0px 1px 0px rgb(0 0 0 / 0.3)',
        //   medium:
        //     '0px 0px 15px 0px rgb(0 0 0 / 0.03), 0px 2px 30px 0px rgb(0 0 0 / 0.08), 0px 0px 1px 0px rgb(0 0 0 / 0.3)',
        //   large:
        //     '0px 0px 30px 0px rgb(0 0 0 / 0.04), 0px 30px 60px 0px rgb(0 0 0 / 0.12), 0px 0px 1px 0px rgb(0 0 0 / 0.3)',
        // },
      },
      colors: {
        default: {
          DEFAULT: '#e7f1ff',
          foreground: '#4982d9',
          50: '#fafafa',
          100: '#f5f5f4',
          200: '#e7e5e4', // Light border - matches our warm gray
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c', // Dark border
          800: '#292524',
          900: '#1c1917',
        },
        primary: {
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
          DEFAULT: '#1B64CE',
          foreground: '#ffffff',
        },
        secondary: {
          '50': '#fef6ee',
          '100': '#fdebd7',
          '200': '#fad3ae',
          '300': '#f6b47b',
          '400': '#f08238',
          '500': '#ed6b22',
          '600': '#de5218',
          '700': '#b93d15',
          '800': '#933219',
          '900': '#762b18',
          DEFAULT: '##ed6b22',
          foreground: '#ffffff',
        },
        // Override HeroUI border colors with warm subtle gray
        divider: '#e7e5e4', // Warm stone-200
        focus: '#1B64CE', // Keep primary focus color
      },
    },
    dark: {
      layout: {
        hoverOpacity: '0.9',
        // boxShadow: {
        //   small:
        //     '0px 0px 5px 0px rgb(0 0 0 / 0.05), 0px 2px 10px 0px rgb(0 0 0 / 0.2), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)',
        //   medium:
        //     '0px 0px 15px 0px rgb(0 0 0 / 0.06), 0px 2px 30px 0px rgb(0 0 0 / 0.22), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)',
        //   large:
        //     '0px 0px 30px 0px rgb(0 0 0 / 0.07), 0px 30px 60px 0px rgb(0 0 0 / 0.26), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)',
        // },
      },
      colors: {
        default: {
          DEFAULT: '#0e1014',
          foreground: '#fcfcfc',
          50: '#fafafa',
          100: '#f5f5f4',
          200: '#e7e5e4', // Light border
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c', // Dark border - matches our warm gray
          800: '#292524',
          900: '#1c1917',
        },
        primary: {
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
          DEFAULT: '#1B64CE',
          foreground: '#ffffff',
        },
        secondary: {
          '50': '#fef6ee',
          '100': '#fdebd7',
          '200': '#fad3ae',
          '300': '#f6b47b',
          '400': '#f08238',
          '500': '#ed6b22',
          '600': '#de5218',
          '700': '#b93d15',
          '800': '#933219',
          '900': '#762b18',
          DEFAULT: '##ed6b22',
          foreground: '#ffffff',
        },
        // Override HeroUI border colors with warm subtle gray
        divider: '#44403c', // Warm stone-600
        focus: '#1B64CE', // Keep primary focus color
      },
    },
  },
});
