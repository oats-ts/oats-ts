/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/tuple-schemas.json (originating from oats-ts/oats-schemas)
 */

import { validators } from '@oats-ts/openapi-runtime'

export const mixedTupleTypeTypeValidator = validators.array(
  validators.tuple(
    validators.string(),
    validators.optional(validators.number()),
    validators.optional(validators.boolean()),
  ),
)

export const optionalTupleTypeTypeValidator = validators.array(
  validators.tuple(
    validators.optional(validators.string()),
    validators.optional(validators.number()),
    validators.optional(validators.boolean()),
  ),
)

export const referenceTargetTypeValidator = validators.object(
  validators.shape({ referenceTarget: validators.optional(validators.literal(true)) }),
)

export const tupleTypeTypeValidator = validators.array(
  validators.tuple(
    validators.string(),
    validators.number(),
    validators.boolean(),
    validators.array(validators.items(validators.string())),
    validators.object(validators.shape({ foo: validators.optional(validators.string()) })),
    validators.lazy(() => referenceTargetTypeValidator),
  ),
)
