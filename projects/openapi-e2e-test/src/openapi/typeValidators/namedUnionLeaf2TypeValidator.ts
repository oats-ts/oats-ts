import { literal, number, object, optional, shape } from '@oats-ts/validators'

export const namedUnionLeaf2TypeValidator = object(
  shape({
    midLevelType: literal('NamedUnionLeaf2'),
    topLevelType: literal('NamedMidLevelUnion'),
    namedUnionLeaf2Property: optional(number()),
  }),
)
