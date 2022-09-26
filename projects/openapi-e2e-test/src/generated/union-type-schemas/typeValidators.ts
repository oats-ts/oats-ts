/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/union-type-schemas.json
 */

import { boolean, lazy, literal, number, object, shape, string, union } from '@oats-ts/validators'

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