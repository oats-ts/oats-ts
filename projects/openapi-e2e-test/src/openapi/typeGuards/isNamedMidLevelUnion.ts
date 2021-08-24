import { NamedMidLevelUnion } from '../types/NamedMidLevelUnion'
import { isNamedUnionLeaf2 } from './isNamedUnionLeaf2'
import { isNamedUnionLeaf3 } from './isNamedUnionLeaf3'

export function isNamedMidLevelUnion(input: any): input is NamedMidLevelUnion {
  return isNamedUnionLeaf2(input) || isNamedUnionLeaf3(input)
}
