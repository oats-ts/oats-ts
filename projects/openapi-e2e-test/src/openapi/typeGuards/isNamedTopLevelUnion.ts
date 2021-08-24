import { NamedTopLevelUnion } from '../types/NamedTopLevelUnion'
import { isNamedMidLevelUnion } from './isNamedMidLevelUnion'
import { isNamedUnionLeaf1 } from './isNamedUnionLeaf1'

export function isNamedTopLevelUnion(input: any): input is NamedTopLevelUnion {
  return isNamedMidLevelUnion(input) || isNamedUnionLeaf1(input)
}
