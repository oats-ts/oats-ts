import { NamedUnionLeaf2 } from '../types/NamedUnionLeaf2'

export function isNamedUnionLeaf2(input: any): input is NamedUnionLeaf2 {
  return (
    input !== null &&
    typeof input === 'object' &&
    input.midLevelType === 'NamedUnionLeaf2' &&
    input.topLevelType === 'NamedMidLevelUnion' &&
    (input.namedUnionLeaf2Property === null ||
      input.namedUnionLeaf2Property === undefined ||
      typeof input.namedUnionLeaf2Property === 'number')
  )
}
