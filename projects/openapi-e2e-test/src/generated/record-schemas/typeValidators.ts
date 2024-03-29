/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/record-schemas.json (originating from oats-ts/oats-schemas)
 */

import { validators } from '@oats-ts/openapi-runtime'

export const arrayRecordTypeTypeValidator = validators.object(
  validators.record(validators.string(), validators.array(validators.items(validators.string()))),
)

export const booleanRecordTypeTypeValidator = validators.object(
  validators.record(validators.string(), validators.boolean()),
)

export const numberRecordTypeTypeValidator = validators.object(
  validators.record(validators.string(), validators.number()),
)

export const objectRecordTypeTypeValidator = validators.object(
  validators.record(validators.string(), validators.object(validators.shape({ foo: validators.string() }))),
)

export const refRecordTypeTypeValidator = validators.object(
  validators.record(
    validators.string(),
    validators.lazy(() => referenceTargetTypeValidator),
  ),
)

export const referenceTargetTypeValidator = validators.object(
  validators.shape({ referenceTarget: validators.optional(validators.literal(true)) }),
)

export const stringRecordTypeTypeValidator = validators.object(
  validators.record(validators.string(), validators.string()),
)
