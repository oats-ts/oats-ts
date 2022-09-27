import type { HttpMethod } from '@oats-ts/openapi-http'
import { SchemaType } from './types'

type ChipStyle = {
  textColor: string
  backgroundColor: string
}

export type Theme = {
  fontFamily: {
    text: string
    code: string
  }
  fontSize: {
    xs: string
    s: string
    m: string
    l: string
    xl: string
  }
  spacing: {
    nil: string
    s: string
    xs: string
    m: string
    l: string
    xl: string
  }
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
    }
    methods: Record<HttpMethod, ChipStyle>
    types: Record<SchemaType, ChipStyle>
  }
  content: {
    container: {
      textColor: string
      backgroundColor: string
    }
  }
}
