import { ExternalSchema } from '../types/ExternalSchema'

export function isExternalSchema(input: any): input is ExternalSchema {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.flightOfferIds === null ||
      input.flightOfferIds === undefined ||
      (Array.isArray(input.flightOfferIds) && input.flightOfferIds.every((item: any) => typeof item === 'string'))) &&
    (input.originDestinationId === null ||
      input.originDestinationId === undefined ||
      typeof input.originDestinationId === 'string')
  )
}
