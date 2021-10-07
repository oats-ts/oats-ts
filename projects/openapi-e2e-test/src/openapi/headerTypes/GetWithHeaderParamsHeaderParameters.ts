import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type GetWithHeaderParamsHeaderParameters = {
  'X-String-In-Headers': string
  'X-Number-In-Headers': number
  'X-Boolean-In-Headers': boolean
  'X-Enum-In-Headers': 'bear' | 'racoon' | 'cat'
  'X-Object-In-Headers': NamedSimpleObject
  'X-Array-In-Headers': string[]
}
