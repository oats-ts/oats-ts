import { boolean, number, object, optional, shape, string } from '@oats-ts/validators'

export const namedSimpleObjectTypeValidator = object(
  shape({
    booleanProperty: boolean(),
    numberProperty: number(),
    optionalBooleanProperty: optional(boolean()),
    optionalNumberProperty: optional(number()),
    optionalStringProperty: optional(string()),
    stringProperty: string(),
  }),
)
