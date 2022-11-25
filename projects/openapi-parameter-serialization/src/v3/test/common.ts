import { dsl } from '../dsl'
import { ValueDsl } from '../types'
import { ObjType } from './model'

export const obj: Record<keyof ObjType, ValueDsl> = {
  s: dsl.value.string(),
  n: dsl.value.number(),
  b: dsl.value.boolean(),
  l: dsl.value.literal('cat'),
  e: dsl.value.enum(['cat', 'dog', 'racoon']),
}
