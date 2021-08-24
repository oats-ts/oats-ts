import { boolean, literal, object, optional, shape } from '@oats-ts/validators'

export const namedUnionLeaf3Validator = object(
  shape({
    midLevelType: literal('NamedUnionLeaf3'),
    topLevelType: literal('NamedMidLevelUnion'),
    namedUnionLeaf3Property: optional(boolean()),
  }),
)
