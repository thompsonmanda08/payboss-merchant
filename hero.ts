import { heroui } from '@heroui/react';

export default heroui({
  addCommonColors: true,

  themes: {
    light: {
      layout: {
        disabledOpacity: '0.4',
        // hoverOpacity: '0.9',
        boxShadow: {
          small:
            '0px 0px 5px 0px rgb(0 0 0 / 0.02), 0px 2px 10px 0px rgb(0 0 0 / 0.06), 0px 0px 1px 0px rgb(0 0 0 / 0.3)',
          medium:
            '0px 0px 15px 0px rgb(0 0 0 / 0.03), 0px 2px 30px 0px rgb(0 0 0 / 0.08), 0px 0px 1px 0px rgb(0 0 0 / 0.3)',
          large:
            '0px 0px 30px 0px rgb(0 0 0 / 0.04), 0px 30px 60px 0px rgb(0 0 0 / 0.12), 0px 0px 1px 0px rgb(0 0 0 / 0.3)',
        },

        radius: {
          small: '8px',
          medium: '12px',
          large: '16px',
        },
        borderWidth: {
          small: '1px',
          medium: '2px',
          large: '3px',
        },
      },

      colors: {
        // default: {
        //   DEFAULT: '#0e1014',
        //   foreground: '#fcfcfc',
        //   '50': '#fcfcfc',
        //   '100': '#efefef',
        //   '200': '#dcdcdc',
        //   '300': '#bdbdbd',
        //   '400': '#989898',
        //   '500': '#7c7c7c',
        //   '600': '#656565',
        //   '700': '#525252',
        //   '800': '#464646',
        //   '900': '#3d3d3d',
        // },
        // background: {
        //   DEFAULT: '#fcfcfc',
        //   foreground: '#0f1010',
        // },
        primary: {
          50: '#f0f6ff', // Very light blue
          100: '#e1edff', // Light blue
          200: '#bbd6ff', // Lighter blue
          300: '#9dc4ff', // Light-medium blue
          400: '#3b81e1', // Medium blue
          500: '#1b64ce', // Default primary (27 100 206)
          600: '#175abc', // Dark-medium blue
          700: '#1551a9', // Dark blue
          800: '#10438d', // Darker blue
          900: '#071e40', // Very dark blue
          DEFAULT: '#1b64ce',
          foreground: '#ffffff',
        },
        secondary: {
          50: '#fef6ee', // Very light orange
          100: '#fdebd7', // Light orange
          200: '#fad3ae', // Lighter orange
          300: '#f6b47b', // Light-medium orange
          400: '#f08238', // Medium orange
          500: '#ed6b22', // Default secondary (237 107 34)
          600: '#de5218', // Dark-medium orange
          700: '#b93d15', // Dark orange
          800: '#933219', // Darker orange
          900: '#762b18', // Very dark orange
          DEFAULT: '#ed6b22',
          foreground: '#ffffff',
        },
        divider: '#e7e5e4', // Warm stone-200
        focus: '#1B64CE', // Keep primary focus color
      },
    },
    dark: {
      colors: {
        // default: {
        //   DEFAULT: '#434349',
        //   '50': '#f7f7f8',
        //   '100': '#eeeef0',
        //   '200': '#dadadd',
        //   '300': '#babbbf',
        //   '400': '#94959c',
        //   '500': '#767681',
        //   '600': '#606169',
        //   '700': '#4e4e56',
        //   '800': '#434349',
        //   '900': '#3b3c3f',
        // },

        // background: {
        //   DEFAULT: '#0f1010',
        //   foreground: '#fcfcfc',
        // },

        primary: {
          50: '#0c1629', // Very dark blue for dark mode
          100: '#162849', // Dark blue
          200: '#1e3a8a', // Medium-dark blue
          300: '#3b82f6', // Medium blue
          400: '#60a5fa', // Light-medium blue
          500: '#3b82f6', // Default primary for dark mode
          600: '#2563eb', // Darker blue
          700: '#1d4ed8', // Dark blue
          800: '#1e40af', // Very dark blue
          900: '#1e3a8a', // Darkest blue
          DEFAULT: '#3b82f6',
          foreground: '#f8fafc',
        },
        secondary: {
          50: '#2c1810', // Very dark orange for dark mode
          100: '#451a03', // Dark orange
          200: '#7c2d12', // Medium-dark orange
          300: '#ea580c', // Medium orange
          400: '#f97316', // Light-medium orange
          500: '#fb923c', // Default secondary for dark mode
          600: '#ea580c', // Darker orange
          700: '#c2410c', // Dark orange
          800: '#9a3412', // Very dark orange
          900: '#7c2d12', // Darkest orange
          DEFAULT: '#fb923c',
          foreground: '#0f172a',
        },
        divider: '#44403c', // Warm stone-600
        focus: '#1B64CE', // Keep primary focus color
      },
    },
  },
});
