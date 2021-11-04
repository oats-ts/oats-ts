import { boolean, lazy, number, object, shape, string } from '@oats-ts/validators'
import { numberArrayTypeValidator } from './numberArrayTypeValidator'
import { simpleEnumTypeValidator } from './simpleEnumTypeValidator'
import { simpleObjectTypeValidator } from './simpleObjectTypeValidator'

export const pathParametersPayloadTypeValidator = object(
  shape({
    a: lazy(() => numberArrayTypeValidator),
    ae: lazy(() => numberArrayTypeValidator),
    b: boolean(),
    be: boolean(),
    e: lazy(() => simpleEnumTypeValidator),
    ee: lazy(() => simpleEnumTypeValidator),
    n: number(),
    ne: number(),
    o: lazy(() => simpleObjectTypeValidator),
    oe: lazy(() => simpleObjectTypeValidator),
    s: string(),
    se: string(),
  }),
)
