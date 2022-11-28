import { dsl } from '../dsl'
import { ValueDsl } from '../types'
import { ObjType, OptObjType } from './model'
import { TestCase } from './types'

export const lit = dsl.value.string(dsl.value.literal('cat'))

export const enm = dsl.value.string(dsl.value.enum(['cat', 'dog', 'racoon']))

export const obj: Record<keyof ObjType, ValueDsl> = {
  s: dsl.value.string(),
  n: dsl.value.number(),
  b: dsl.value.boolean(),
  l: lit,
  e: enm,
}

export const optObj: Record<keyof OptObjType, ValueDsl> = {
  s: dsl.value.optional(dsl.value.string()),
  n: dsl.value.optional(dsl.value.number()),
  b: dsl.value.optional(dsl.value.boolean()),
  l: dsl.value.optional(lit),
  e: dsl.value.optional(enm),
}

export function testCases(cases: Record<string, TestCase<any, any, any>>) {
  const vals = Object.values(cases)
  const only = vals.filter((c) => c.only)
  if (only.length > 0) {
    return only
  }
  return vals.filter((c) => !c.ignore)
}
