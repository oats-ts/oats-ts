import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type GetWithPathParamsPathParameters = {
  stringInPath: string
  numberInPath: number
  booleanInPath: boolean
  enumInPath: 'bear' | 'racoon' | 'cat'
  objectInPath: NamedSimpleObject
  arrayInPath: string[]
}
