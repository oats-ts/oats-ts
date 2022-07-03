/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/object-schemas.json
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

export type ObjectWithNestedTypeFieldsType = {
  arrayField: string[]
  enumField: 'A' | 'B' | 'C'
  objectField: {
    nestedField?: string
  }
  tupleField: [string?, number?]
}

export type ObjectWithOptionalPrimitiveFieldsType = {
  booleanField?: boolean
  numberField?: number
  stringField?: string
}

export type ObjectWithPrimitiveFieldsType = {
  booleanField: boolean
  numberField: number
  stringField: string
}

export type ObjectWithReferenceFieldsType = {
  referenceArrayField: ReferenceTarget[]
  referenceField: ReferenceTarget
}

export type ReferenceTarget = {
  referenceTarget?: true
}

export const objectWithNestedTypeFieldsTypeTypeValidator = object(
  shape({
    arrayField: array(items(string())),
    enumField: union({
      A: literal('A'),
      B: literal('B'),
      C: literal('C'),
    }),
    objectField: object(shape({ nestedField: optional(string()) })),
    tupleField: array(tuple(optional(string()), optional(number()))),
  }),
)

export const objectWithOptionalPrimitiveFieldsTypeTypeValidator = object(
  shape({
    booleanField: optional(boolean()),
    numberField: optional(number()),
    stringField: optional(string()),
  }),
)

export const objectWithPrimitiveFieldsTypeTypeValidator = object(
  shape({
    booleanField: boolean(),
    numberField: number(),
    stringField: string(),
  }),
)

export const objectWithReferenceFieldsTypeTypeValidator = object(
  shape({
    referenceArrayField: array(items(lazy(() => referenceTargetTypeValidator))),
    referenceField: lazy(() => referenceTargetTypeValidator),
  }),
)

export const referenceTargetTypeValidator = object(shape({ referenceTarget: optional(literal(true)) }))

export function isObjectWithNestedTypeFieldsType(input: any): input is ObjectWithNestedTypeFieldsType {
  return (
    input !== null &&
    typeof input === 'object' &&
    Array.isArray(input.arrayField) &&
    input.arrayField.every((item: any) => typeof item === 'string') &&
    (input.enumField === 'A' || input.enumField === 'B' || input.enumField === 'C') &&
    input.objectField !== null &&
    typeof input.objectField === 'object' &&
    (input.objectField.nestedField === null ||
      input.objectField.nestedField === undefined ||
      typeof input.objectField.nestedField === 'string') &&
    Array.isArray(input.tupleField) &&
    (input.tupleField[0] === null || input.tupleField[0] === undefined || typeof input.tupleField[0] === 'string') &&
    (input.tupleField[1] === null || input.tupleField[1] === undefined || typeof input.tupleField[1] === 'number')
  )
}

export function isObjectWithOptionalPrimitiveFieldsType(input: any): input is ObjectWithOptionalPrimitiveFieldsType {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.booleanField === null || input.booleanField === undefined || typeof input.booleanField === 'boolean') &&
    (input.numberField === null || input.numberField === undefined || typeof input.numberField === 'number') &&
    (input.stringField === null || input.stringField === undefined || typeof input.stringField === 'string')
  )
}

export function isObjectWithPrimitiveFieldsType(input: any): input is ObjectWithPrimitiveFieldsType {
  return (
    input !== null &&
    typeof input === 'object' &&
    typeof input.booleanField === 'boolean' &&
    typeof input.numberField === 'number' &&
    typeof input.stringField === 'string'
  )
}

export function isObjectWithReferenceFieldsType(input: any): input is ObjectWithReferenceFieldsType {
  return (
    input !== null &&
    typeof input === 'object' &&
    Array.isArray(input.referenceArrayField) &&
    input.referenceArrayField.every((item: any) => isReferenceTarget(item) as boolean) &&
    (isReferenceTarget(input.referenceField) as boolean)
  )
}

export function isReferenceTarget(input: any): input is ReferenceTarget {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.referenceTarget === null || input.referenceTarget === undefined || input.referenceTarget === true)
  )
}
