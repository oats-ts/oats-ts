import { Theme } from './theme'

export const defaultTheme: Theme = {
  textFontFamily: "'Open Sans', sans-serif",
  codeFontFamily: 'Poppins, sans-serif',
  nav: {
    container: {
      backgroundColor: '#D0DBE6',
    },
    sectionTitle: {
      textColor: '#022b3a',
    },
    item: {
      backgroundColor: 'transparent',
      textColor: '#022b3a',
      activeBackgroundColor: '#022b3a',
      activeTextColor: '#ffffff',
      fontSize: '14px',
    },
    methods: {
      fontSize: '11px',
      delete: {
        textColor: '#fff',
        backgroundColor: '#a4161a',
      },
      post: {
        textColor: '#fff',
        backgroundColor: '#8f2d56',
      },
      patch: {
        textColor: '#fff',
        backgroundColor: '#f3722c',
      },
      get: {
        textColor: '#fff',
        backgroundColor: '#6a994e',
      },
      put: {
        textColor: '#fff',
        backgroundColor: '#277da1',
      },
      head: {
        textColor: '#fff',
        backgroundColor: '#577590',
      },
      options: {
        textColor: '#fff',
        backgroundColor: '#43aa8b',
      },
      trace: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
    },
  },
  content: {
    container: {
      textColor: '#022b3a',
      backgroundColor: '#fff',
      fontSize: '14px',
    },
  },
}
