import { boolean, lazy, number, object, shape, string } from '@oats-ts/validators'
import { simpleEnumTypeValidator } from './simpleEnumTypeValidator'

export const simpleObjectTypeValidator = object(
  shape({
    b: boolean(),
    e: lazy(() => simpleEnumTypeValidator),
    n: number(),
    s: string(),
  }),
)
