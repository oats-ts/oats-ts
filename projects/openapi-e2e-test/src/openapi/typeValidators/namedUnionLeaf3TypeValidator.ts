import { boolean, literal, object, optional, shape } from '@oats-ts/validators'

export const namedUnionLeaf3TypeValidator = object(
  shape({
    midLevelType: literal('NamedUnionLeaf3'),
    topLevelType: literal('NamedMidLevelUnion'),
    namedUnionLeaf3Property: optional(boolean()),
  }),
)
