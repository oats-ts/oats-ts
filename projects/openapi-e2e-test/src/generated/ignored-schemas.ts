/*
 * This file has been generated by Oats, please don't modify it by hand!
 * 
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/ignored-schemas.json
 */

import { array, items, literal, object, shape, string } from '@oats-ts/validators'

export type IgnoredFieldsType = {
  ignored: string[]
  type: 'discriminator-field'
}

export const ignoredFieldsTypeTypeValidator = object(
  shape({
    ignored: array(items(string())),
    type: literal('discriminator-field'),
  }),
)

export function isIgnoredFieldsType(input: any): input is IgnoredFieldsType {
  return (
    input !== null &&
    typeof input === 'object' &&
    Array.isArray(input.ignored) &&
    input.ignored.every((item: any) => typeof item === 'string') &&
    input.type === 'discriminator-field'
  )
}