import { boolean, lazy, number, object, optional, shape, string } from '@oats-ts/validators'
import { simpleEnumTypeValidator } from './simpleEnumTypeValidator'

export const simpleObjectTypeValidator = object(
  shape({
    b: optional(boolean()),
    e: optional(lazy(() => simpleEnumTypeValidator)),
    n: optional(number()),
    s: optional(string()),
  }),
)
