import { validators } from '@oats-ts/validators'
import { parameter } from '../parameter'
import { ValueDescriptor } from '../types'
import { ComplexObj, ObjType, OptObjType } from './model'
import { TestCase } from './types'

const { object, shape, optional, string, boolean, number, union, literal } = validators

export const enumSchema = union({
  cat: literal('cat'),
  dog: literal('dog'),
  racoon: literal('racoon'),
})

export const litSchema = literal('cat')

export const objSchema = object(
  shape<ObjType>({
    b: boolean(),
    e: enumSchema,
    l: litSchema,
    n: number(),
    s: string(),
  }),
)

export const optObjSchema = object(
  shape<OptObjType>({
    b: optional(boolean()),
    e: optional(enumSchema),
    l: optional(litSchema),
    n: optional(number()),
    s: optional(string()),
  }),
)

export const complexObjSchema = object(
  shape<ComplexObj>({
    opt: optObjSchema,
    req: objSchema,
  }),
)

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
