/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/optional-request-body.json
 */

import { OptionalRequestBodyRequest } from './requestTypes'
import { OptionalRequestBodyResponse } from './responseTypes'

export type BodiesSdk = {
  optionalRequestBody(request: OptionalRequestBodyRequest): Promise<OptionalRequestBodyResponse>
}