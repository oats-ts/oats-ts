import { lazy, union } from '@oats-ts/validators'
import { namedMidLevelUnionTypeValidator } from './namedMidLevelUnionTypeValidator'
import { namedUnionLeaf1TypeValidator } from './namedUnionLeaf1TypeValidator'

export const namedTopLevelUnionTypeValidator = union({
  NamedMidLevelUnion: lazy(() => namedMidLevelUnionTypeValidator),
  NamedUnionLeaf1: lazy(() => namedUnionLeaf1TypeValidator),
})
