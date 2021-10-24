import { array, items, object, optional, shape, string } from '@oats-ts/validators'

export const externalSchemaTypeValidator = object(
  shape({
    flightOfferIds: optional(array(items(string()))),
    originDestinationId: optional(string()),
  }),
)
