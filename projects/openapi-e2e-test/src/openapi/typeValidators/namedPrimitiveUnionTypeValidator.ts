import { boolean, number, string, union } from '@oats-ts/validators'

export const namedPrimitiveUnionTypeValidator = union({
  number: number(),
  string: string(),
  boolean: boolean(),
})
