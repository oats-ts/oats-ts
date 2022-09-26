import { Theme } from './theme'

export const defaultTheme: Theme = {
  textFontFamily: "'Open Sans', sans-serif",
  codeFontFamily: 'Poppins, sans-serif',
  content: {
    backgroundColor: '#ffffff',
  },
  navBar: {
    backgroundColor: '#D0DBE6',
  },
  navItem: {
    backgroundColor: 'transparent',
    textColor: '#022b3a',
    activeBackgroundColor: '#022b3a',
    activeTextColor: '#ffffff',
    fontSize: '15px',
  },
  methodChip: {
    fontSize: '11px',
    textColor: {
      delete: '#fff',
      get: '#fff',
      head: '#fff',
      options: '#fff',
      patch: '#fff',
      post: '#fff',
      put: '#fff',
      trace: '#fff',
    },
    backgroundColor: {
      delete: '#a4161a', //'#f94144',
      post: '#f3722c',
      patch: '#43aa8b',
      get: '#6a994e', //'#90be6d',
      put: '#277da1',
      head: '#577590',
      options: '#8f2d56',
      trace: '#4d908e',
    },
  },
}
