import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import { setTailwindCssVariables } from 'better-write-plugin-theme'

export default defineConfig({
  extract: {
    include: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    exclude: [
      'node_modules/**/*',
      '.git/**/*',
    ],
  },
  shortcuts: {
    'wb-h1': 'ml-5 relative top-3 sm:top-4 lg:top-6 md:ml-10 text-3xl sm:text-4xl lg:text-5xl font-bold',
    'wb-base': 'bg-theme-background-1 w-full h-screen',
    'wb-title': 'text-4xl opacity-70 hover:text-theme-text-3 cursor-default',
    'wb-icon': 'text-theme-icon hover:text-theme-icon-hover active:text-theme-icon-active cursor-pointer',
    'wb-text': 'text-theme-text-1',
    'wb-background-color': 'bg-theme-background-1',
    'wb-aside-button': 'text-2xs pl-2 transition w-full font-bold text-theme-text-2 rounded-none flex',
    'wb-input-container': 'flex flex-1 h-auto w-auto items-center justify-between p-5 border rounded-lg border-theme-editor-material-border bg-theme-editor-material-background hover:bg-theme-editor-material-background-hover active:bg-theme-editor-material-background-active text-theme-editor-material-text hover:text-theme-editor-material-text-hover active:text-theme-editor-material-text-active shadow-lg',
    'wb-pdf-container': 'flex flex-row gap-5 flex-wrap justify-between items-center my-3 overflow-x-hidden',
    'wb-disabled': 'opacity-50 pointer-events-none',
    'wb-configuration-absolute': 'absolute top-0 left-0 bg-theme-background-1 flex flex-col h-screen w-full z-max px-2 py-5 md:px-20 overflow-y-auto overflow-x-hidden',
    'wb-configuration': 'flex gap-5 font-bold text-base text-theme-text-2 justify-between items-center w-full px-2 py-2',
    'wb-configuration-reserve': 'flex flex-row-reverse md:flex-row gap-5 font-bold text-base text-theme-text-2 justify-between items-center w-full px-2 py-2',
    'wb-configuration-input-text': 'bg-theme-editor-material-background px-2 shadow-lg w-full md:w-60',
    'wb-indent': 'indent-8',
    'wb-header-button': 'wb-text mx-0.5 md:mx-2',
    'wb-drau-icon': 'wb-icon w-8 h-8 md:(w-6 h-6)'
  },
  theme: {
    fontFamily: {
      'poppins': ['Poppins', 'ui-sans-serif', 'system-ui'],
      'raleway': ['Raleway', 'ui-sans-serif', 'system-ui'],
    },
    colors: {
      ...setTailwindCssVariables(),
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
    },
    fontSize: {
      '3xs': '.6rem',
      '2xs': '.875rem',
      'xs': '.875rem',
      'sm': '1rem',
      'tiny': '1rem',
      'base': '1.125rem',
      'lg': '1.25rem',
      'xl': '1.5rem',
      '2xl': '1.875rem',
      '3xl': '2.25rem',
      '4xl': '3rem',
      '5xl': '4rem',
      '6xl': '5em',
      '7xl': '6rem',
     },
    extend: {
      top: theme => ({
        'top-0.75': '0.2rem'
      }),
      height: theme => ({
        "editor": "75vh",
        "editor-mobile": "90vh"
      }),
      maxHeight: theme => ({
        "editor": "75vh",
        "editor-mobile": "90vh"
      }),
      minHeight: theme => ({
        "editor": "75vh",
        "editor-mobile": "90vh"
      }),
      backgroundColor: theme => ({
        "black-opacity": 'rgba(0,0,0, 0.15)',
        "white-opacity": 'rgba(255,255,255, 0.1)',
        "modal": 'rgba(0,0,0, 0.4)'
      }),
      boxShadow: theme => ({
        "binset": `rgba(50, 50, 93, 0.4) 0px 2px 5px -1px, rgba(0, 0, 0, 0.65) 0px 1px 3px -1px;`,
        "winset": `rgba(50, 50, 93, 0.3) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;`,
        "wp-shadow": 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;'
      }),
      zIndex: theme => ({
        "umax": "999999",
        "max": "9999",
        "preview": "200",
        "aside": "40",
        "aside-open": "40",
        "min": "-1"
      }),
      whiteSpace: theme => ({
        "some-break": "break-spaces"
      })
    },
    textIndent: {
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.50rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
      '11': '3rem',
      '12': '3.5rem',
      '13': '4rem',
      '14': '4.5rem',
      '15': '5rem',
      '16': '5.5rem',
      '17': '6rem',
      '18': '6.5rem',
      '19': '7rem',
      '20': '7.5rem'
    },
    textShadow: {
      'default': '0 2px 5px rgba(0, 0, 0, 0.5)',
      'lg': '0 2px 10px rgba(0, 0, 0, 0.5)',
    },
    textDecorationStyle: {
      'solid': 'solid',
      'double': 'double',
      'dotted': 'dotted',
      'dashed': 'dashed',
      'wavy': 'wavy',
    },
    textDecorationColor: {
      'red': '#f00',
      'green': '#0f0',
      'blue': '#00f',
    },
    fontVariantCaps: {
      'normal': 'normal',
      'small': 'small-caps',
      'all-small': 'all-small-caps',
      'petite': 'petite-caps',
      'unicase': 'unicase',
      'titling': 'titling-caps',
    },
    fontVariantNumeric: {
      'normal': 'normal',
      'ordinal': 'ordinal',
      'slashed-zero': 'slashed-zero',
      'lining': 'lining-nums',
      'oldstyle': 'oldstyle-nums',
      'proportional': 'proportional-nums',
      'tabular': 'tabular-nums',
      'diagonal-fractions': 'diagonal-fractions',
      'stacked-fractions': 'stacked-fractions',
    },
    fontVariantLigatures: {
      'normal': 'normal',
      'none': 'none',
      'common': 'common-ligatures',
      'no-common': 'no-common-ligatures',
      'discretionary': 'discretionary-ligatures',
      'no-discretionary': 'no-discretionary-ligatures',
      'historical': 'historical-ligatures',
      'no-historical': 'no-historical-ligatures',
      'contextual': 'contextual',
      'no-contextual': 'no-contextual',
    },
    textRendering: {
      'rendering-auto': 'auto',
      'optimize-legibility': 'optimizeLegibility',
      'optimize-speed': 'optimizeSpeed',
      'geometric-precision': 'geometricPrecision'
    },
    textStyles: theme => ({
      heading: {
        output: false,
        fontWeight: theme('fontWeight.bold'),
        lineHeight: theme('lineHeight.tight'),
      },
      h1: {
        extends: 'heading',
        fontSize: theme('fontSize.5xl'),
        '@screen sm': {
          fontSize: theme('fontSize.6xl'),
        },
      },
      h2: {
        extends: 'heading',
        fontSize: theme('fontSize.4xl'),
        '@screen sm': {
          fontSize: theme('fontSize.5xl'),
        },
      },
      h3: {
        extends: 'heading',
        fontSize: theme('fontSize.4xl'),
      },
      h4: {
        extends: 'heading',
        fontSize: theme('fontSize.3xl'),
      },
      h5: {
        extends: 'heading',
        fontSize: theme('fontSize.2xl'),
      },
      h6: {
        extends: 'heading',
        fontSize: theme('fontSize.xl'),
      },
      link: {
        fontWeight: theme('fontWeight.bold'),
        color: theme('colors.blue.400'),
        '&:hover': {
          color: theme('colors.blue.600'),
          textDecoration: 'underline',
        },
      },
      richText: {
        fontWeight: theme('fontWeight.normal'),
        fontSize: theme('fontSize.base'),
        lineHeight: theme('lineHeight.relaxed'),
        '> * + *': {
          marginTop: '1em',
        },
        'h1': {
          extends: 'h1',
        },
        'h2': {
          extends: 'h2',
        },
        'h3': {
          extends: 'h3',
        },
        'h4': {
          extends: 'h4',
        },
        'h5': {
          extends: 'h5',
        },
        'h6': {
          extends: 'h6',
        },
        'ul': {
          listStyleType: 'disc',
        },
        'ol': {
          listStyleType: 'decimal',
        },
        'a': {
          extends: 'link',
        },
        'b, strong': {
          fontWeight: theme('fontWeight.bold'),
        },
        'i, em': {
          fontStyle: 'italic',
        },
      },
    }),
  },
  plugins: [],
})
