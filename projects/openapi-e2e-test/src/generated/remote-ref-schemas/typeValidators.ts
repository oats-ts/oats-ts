/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/remote-ref-schemas.json (originating from oats-ts/oats-schemas)
 */

import { validators } from '@oats-ts/openapi-runtime'

export const referenceTargetTypeValidator = validators.object(
  validators.shape({ referenceTarget: validators.optional(validators.literal(true)) }),
)

export const typeWithRemoteRefFieldTypeValidator = validators.object(
  validators.shape({
    referenceArrayField: validators.array(validators.items(validators.lazy(() => referenceTargetTypeValidator))),
    referenceField: validators.lazy(() => referenceTargetTypeValidator),
  }),
)
