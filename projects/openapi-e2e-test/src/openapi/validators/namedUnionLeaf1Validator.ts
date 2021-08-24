import { literal, object, optional, shape, string } from '@oats-ts/validators'

export const namedUnionLeaf1Validator = object(
  shape({
    topLevelType: literal('NamedUnionLeaf1'),
    namedUnionLeaf1Property: optional(string()),
  }),
)
