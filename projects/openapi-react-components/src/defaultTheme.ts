import { Theme } from './theme'

export const defaultTheme: Theme = {
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
    },
    methods: {
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
    types: {
      array: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
      boolean: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
      enum: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
      intersection: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
      literal: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
      number: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
      object: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
      record: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
      ref: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
      string: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
      tuple: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
      union: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
      unknown: {
        textColor: '#fff',
        backgroundColor: '#4d908e',
      },
    },
  },
  content: {
    container: {
      textColor: '#022b3a',
      backgroundColor: '#fff',
    },
  },
  fontFamily: {
    text: "'Open Sans', sans-serif",
    code: "'Source Code Pro', monospace",
  },
  fontSize: {
    xs: '11px',
    s: '14px',
    m: '16px',
    l: '24px',
    xl: '32px',
  },
  spacing: {
    nil: '0px',
    xs: '4px',
    s: '8px',
    m: '16px',
    l: '24px',
    xl: '36px',
  },
}
