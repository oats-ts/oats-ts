import type { HttpMethod } from '@oats-ts/openapi-http'

export type Theme = {
  textFontFamily: string
  codeFontFamily: string
  nav: {
    container: {
      backgroundColor: string
    }
    sectionTitle: {
      textColor: string
    }
    item: {
      activeBackgroundColor: string
      backgroundColor: string
      activeTextColor: string
      textColor: string
      fontSize: string
    }
    methods: Record<HttpMethod, { textColor: string; backgroundColor: string }> & { fontSize: string }
  }
  content: {
    container: {
      textColor: string
      backgroundColor: string
      fontSize: string
    }
  }
}
