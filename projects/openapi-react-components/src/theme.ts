import type { HttpMethod } from '@oats-ts/openapi-http'

export type Theme = {
  textFontFamily: string
  codeFontFamily: string
  navBar: {
    backgroundColor: string
  }
  navItem: {
    activeBackgroundColor: string
    backgroundColor: string
    activeTextColor: string
    textColor: string
    fontSize: string
  }
  methodChip: {
    fontSize: string
    textColor: Record<HttpMethod, string>
    backgroundColor: Record<HttpMethod, string>
  }
  content: {
    backgroundColor: string
  }
}
