/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/partial-content.json (originating from oats-ts/oats-schemas)
 */

import { validators } from '@oats-ts/openapi-runtime'

export const optionalRequestBodyResponseBodyValidator = {
  200: { 'application/json': validators.object(validators.shape({ foo: validators.optional(validators.string()) })) },
} as const
