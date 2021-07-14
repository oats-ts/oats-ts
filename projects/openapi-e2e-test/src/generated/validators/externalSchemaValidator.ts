import { array, items, object, optional, shape, string } from '@oats-ts/validators'

export const externalSchemaValidator = object(
  shape({
    flightOfferIds: optional(array(items(string()))),
    originDestinationId: optional(string()),
  }),
)
