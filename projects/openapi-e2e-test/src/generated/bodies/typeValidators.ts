/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/generated-schemas/bodies.json
 */

import {
  array,
  boolean,
  items,
  lazy,
  literal,
  number,
  object,
  optional,
  shape,
  string,
  tuple,
  union,
} from '@oats-ts/validators'

export const enumTypeTypeValidator = union({
  A: literal('A'),
  B: literal('B'),
  C: literal('C'),
})

export const objectWithArraysTypeValidator = object(
  shape({
    boolArr: array(items(boolean())),
    enmArr: array(items(lazy(() => enumTypeTypeValidator))),
    numArr: array(items(number())),
    strArr: array(items(string())),
  }),
)

export const objectWithNestedObjectsTypeValidator = object(
  shape({
    arrObj: lazy(() => objectWithArraysTypeValidator),
    primObj: lazy(() => objectWithPrimitivesTypeValidator),
  }),
)

export const objectWithPrimitivesTypeValidator = object(
  shape({
    bool: boolean(),
    enm: lazy(() => enumTypeTypeValidator),
    lit: literal('Literal Value'),
    num: number(),
    str: string(),
  }),
)

export const primitiveOptionalTupleTypeTypeValidator = array(
  tuple(
    optional(literal('Literal Value')),
    optional(string()),
    optional(number()),
    optional(lazy(() => enumTypeTypeValidator)),
    optional(boolean()),
  ),
)

export const primitiveTupleTypeTypeValidator = array(
  tuple(
    literal('Literal Value'),
    string(),
    number(),
    lazy(() => enumTypeTypeValidator),
    boolean(),
  ),
)