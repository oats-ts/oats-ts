import { lazy, union } from '@oats-ts/validators'
import { namedUnionLeaf2Validator } from './namedUnionLeaf2Validator'
import { namedUnionLeaf3Validator } from './namedUnionLeaf3Validator'

export const namedMidLevelUnionValidator = union({
  NamedUnionLeaf2: lazy(() => namedUnionLeaf2Validator),
  NamedUnionLeaf3: lazy(() => namedUnionLeaf3Validator),
})
