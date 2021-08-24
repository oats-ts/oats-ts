import { NamedUnionLeaf3 } from '../types/NamedUnionLeaf3'

export function isNamedUnionLeaf3(input: any): input is NamedUnionLeaf3 {
  return (
    input !== null &&
    typeof input === 'object' &&
    input.midLevelType === 'NamedUnionLeaf3' &&
    input.topLevelType === 'NamedMidLevelUnion' &&
    (input.namedUnionLeaf3Property === null ||
      input.namedUnionLeaf3Property === undefined ||
      typeof input.namedUnionLeaf3Property === 'boolean')
  )
}
