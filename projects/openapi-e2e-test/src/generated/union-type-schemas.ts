/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/union-type-schemas.json
 */

import { boolean, lazy, literal, number, object, shape, string, union } from '@oats-ts/validators'

export type InlineObjectUnionType =
  | {
      foo: string
    }
  | {
      bar: number
    }

export type LeafType1 = {
  foo: string
  type: 'LeafType1'
}

export type LeafType2 = {
  bar: string
  type: 'LeafType2'
}

export type LeafType3 = {
  foobar: string
  type: 'LeafType3'
}

export type MidLevelUnionType = LeafType2 | LeafType3

export type PrimitiveUnionType = string | number | boolean

export type TopLevelUnionType = LeafType1 | MidLevelUnionType

export const inlineObjectUnionTypeTypeValidator = union({
  object0: object(shape({ foo: string() })),
  object1: object(shape({ bar: number() })),
})

export const leafType1TypeValidator = object(
  shape({
    foo: string(),
    type: literal('LeafType1'),
  }),
)

export const leafType2TypeValidator = object(
  shape({
    bar: string(),
    type: literal('LeafType2'),
  }),
)

export const leafType3TypeValidator = object(
  shape({
    foobar: string(),
    type: literal('LeafType3'),
  }),
)

export const midLevelUnionTypeTypeValidator = union({
  LeafType2: lazy(() => leafType2TypeValidator),
  LeafType3: lazy(() => leafType3TypeValidator),
})

export const primitiveUnionTypeTypeValidator = union({
  string: string(),
  number: number(),
  boolean: boolean(),
})

export const topLevelUnionTypeTypeValidator = union({
  LeafType1: lazy(() => leafType1TypeValidator),
  MidLevelUnionType: lazy(() => midLevelUnionTypeTypeValidator),
})

export function isInlineObjectUnionType(input: any): input is InlineObjectUnionType {
  return (
    (input !== null && typeof input === 'object' && typeof input.foo === 'string') ||
    (input !== null && typeof input === 'object' && typeof input.bar === 'number')
  )
}

export function isLeafType1(input: any): input is LeafType1 {
  return input !== null && typeof input === 'object' && typeof input.foo === 'string' && input.type === 'LeafType1'
}

export function isLeafType2(input: any): input is LeafType2 {
  return input !== null && typeof input === 'object' && typeof input.bar === 'string' && input.type === 'LeafType2'
}

export function isLeafType3(input: any): input is LeafType3 {
  return input !== null && typeof input === 'object' && typeof input.foobar === 'string' && input.type === 'LeafType3'
}

export function isMidLevelUnionType(input: any): input is MidLevelUnionType {
  return (isLeafType2(input) as boolean) || (isLeafType3(input) as boolean)
}

export function isPrimitiveUnionType(input: any): input is PrimitiveUnionType {
  return typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean'
}

export function isTopLevelUnionType(input: any): input is TopLevelUnionType {
  return (isLeafType1(input) as boolean) || (isMidLevelUnionType(input) as boolean)
}
