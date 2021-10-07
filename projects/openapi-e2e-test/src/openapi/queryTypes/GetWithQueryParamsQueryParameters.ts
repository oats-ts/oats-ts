import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type GetWithQueryParamsQueryParameters = {
  stringInQuery: string
  numberInQuery: number
  booleanInQuery: boolean
  enumInQuery: 'bear' | 'racoon' | 'cat'
  objectInQuery: NamedSimpleObject
  arrayInQuery: string[]
}
