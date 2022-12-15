import { parameter } from '../parameter'
import { ValueDescriptor } from '../types'
import { ObjType, OptObjType } from './model'
import { TestCase } from './types'

export const obj: Record<keyof ObjType, ValueDescriptor> = {
  s: parameter.value.string(),
  n: parameter.value.number(),
  b: parameter.value.boolean(),
  l: parameter.value.string(),
  e: parameter.value.string(),
}

export const optObj: Record<keyof OptObjType, ValueDescriptor> = {
  s: parameter.value.optional(parameter.value.string()),
  n: parameter.value.optional(parameter.value.number()),
  b: parameter.value.optional(parameter.value.boolean()),
  l: parameter.value.optional(parameter.value.string()),
  e: parameter.value.optional(parameter.value.string()),
}

export function testCases(cases: Record<string, TestCase<any, any, any>>) {
  const vals = Object.values(cases)
  const only = vals.filter((c) => c.only)
  if (only.length > 0) {
    return only
  }
  return vals.filter((c) => !c.ignore)
}
