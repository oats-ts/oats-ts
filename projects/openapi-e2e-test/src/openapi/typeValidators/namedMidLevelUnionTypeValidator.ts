import { lazy, union } from '@oats-ts/validators'
import { namedUnionLeaf2TypeValidator } from './namedUnionLeaf2TypeValidator'
import { namedUnionLeaf3TypeValidator } from './namedUnionLeaf3TypeValidator'

export const namedMidLevelUnionTypeValidator = union({
  NamedUnionLeaf2: lazy(() => namedUnionLeaf2TypeValidator),
  NamedUnionLeaf3: lazy(() => namedUnionLeaf3TypeValidator),
})
