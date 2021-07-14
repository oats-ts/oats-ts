import { boolean, number, string, union } from '@oats-ts/validators'

export const namedPrimitiveUnionValidator = union({
  number: number(),
  string: string(),
  boolean: boolean(),
})
