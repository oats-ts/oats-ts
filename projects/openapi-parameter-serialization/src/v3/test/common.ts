import { parameter } from '../parameter'
import { ValueDsl } from '../types'
import { ObjType, OptObjType } from './model'
import { TestCase } from './types'

export const lit = parameter.value.string(parameter.value.literal('cat'))

export const enm = parameter.value.string(parameter.value.enum(['cat', 'dog', 'racoon']))

export const obj: Record<keyof ObjType, ValueDsl> = {
  s: parameter.value.string(),
  n: parameter.value.number(),
  b: parameter.value.boolean(),
  l: lit,
  e: enm,
}

export const optObj: Record<keyof OptObjType, ValueDsl> = {
  s: parameter.value.optional(parameter.value.string()),
  n: parameter.value.optional(parameter.value.number()),
  b: parameter.value.optional(parameter.value.boolean()),
  l: parameter.value.optional(lit),
  e: parameter.value.optional(enm),
}

export function testCases(cases: Record<string, TestCase<any, any, any>>) {
  const vals = Object.values(cases)
  const only = vals.filter((c) => c.only)
  if (only.length > 0) {
    return only
  }
  return vals.filter((c) => !c.ignore)
}
