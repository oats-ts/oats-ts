/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/parameters.json (originating from oats-ts/oats-schemas)
 */

import { validators as _validators } from '@oats-ts/openapi-runtime'
import { simpleResponseHeaderParametersTypeValidator } from './typeValidators'

export const simpleResponseHeaderParametersRequestBodyValidator = {
  'application/json': _validators.lazy(() => simpleResponseHeaderParametersTypeValidator),
} as const
