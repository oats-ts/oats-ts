/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from edge-cases/discriminated-union-with-intersection.json (originating from oats-ts/oats-schemas)
 */

import { validators } from '@oats-ts/openapi-runtime'

export const leafIntersectionTypeTypeValidator = validators.combine(
  validators.object(validators.shape({ racoon: validators.optional(validators.string()) })),
  validators.object(validators.shape({ meerkat: validators.optional(validators.number()) })),
  validators.object(validators.shape({ type: validators.literal('LeafIntersectionType') })),
)

export const leafType1TypeValidator = validators.object(
  validators.shape({
    type: validators.literal('LeafType1'),
    foo: validators.string(),
  }),
)

export const leafType2TypeValidator = validators.object(
  validators.shape({
    type: validators.literal('LeafType2'),
    bar: validators.string(),
  }),
)

export const leafType3TypeValidator = validators.object(
  validators.shape({
    type: validators.literal('LeafType3'),
    foobar: validators.string(),
  }),
)

export const midLevelIntersectionTypeTypeValidator = validators.combine(
  validators.object(validators.shape({ cat: validators.optional(validators.string()) })),
  validators.object(validators.shape({ dog: validators.optional(validators.number()) })),
  validators.object(validators.shape({ type: validators.literal('MidLevelIntersectionType') })),
)

export const midLevelUnionTypeTypeValidator = validators.union({
  LeafType2: validators.lazy(() => leafType2TypeValidator),
  LeafType3: validators.lazy(() => leafType3TypeValidator),
  LeafIntersectionType: validators.lazy(() => leafIntersectionTypeTypeValidator),
})

export const topLevelUnionTypeTypeValidator = validators.union({
  LeafType1: validators.lazy(() => leafType1TypeValidator),
  MidLevelUnionType: validators.lazy(() => midLevelUnionTypeTypeValidator),
  MidLevelIntersectionType: validators.lazy(() => midLevelIntersectionTypeTypeValidator),
})