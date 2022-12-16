import { parameters, ValueParameterRule } from '@oats-ts/rules'
import { ObjType, OptObjType } from './model'
import { TestCase } from './types'

export const obj: Record<keyof ObjType, ValueParameterRule> = {
  s: parameters.value.string(),
  n: parameters.value.number(),
  b: parameters.value.boolean(),
  l: parameters.value.string(),
  e: parameters.value.string(),
}

export const optObj: Record<keyof OptObjType, ValueParameterRule> = {
  s: parameters.value.optional(parameters.value.string()),
  n: parameters.value.optional(parameters.value.number()),
  b: parameters.value.optional(parameters.value.boolean()),
  l: parameters.value.optional(parameters.value.string()),
  e: parameters.value.optional(parameters.value.string()),
}

export function testCases(cases: Record<string, TestCase<any, any, any>>) {
  const vals = Object.values(cases)
  const only = vals.filter((c) => c.only)
  if (only.length > 0) {
    return only
  }
  return vals.filter((c) => !c.ignore)
}
