import { lazy, union } from '@oats-ts/validators'
import { namedMidLevelUnionValidator } from './namedMidLevelUnionValidator'
import { namedUnionLeaf1Validator } from './namedUnionLeaf1Validator'

export const namedTopLevelUnionValidator = union({
  NamedMidLevelUnion: lazy(() => namedMidLevelUnionValidator),
  NamedUnionLeaf1: lazy(() => namedUnionLeaf1Validator),
})
