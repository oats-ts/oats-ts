/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/optional-request-body.json (originating from oats-ts/oats-schemas)
 */

import { OptionalRequestBodyRequest } from './requestTypes'
import { OptionalRequestBodyResponse } from './responseTypes'

export type OptionalBodiesSdk = {
  optionalRequestBody(request: OptionalRequestBodyRequest): Promise<OptionalRequestBodyResponse>
}
