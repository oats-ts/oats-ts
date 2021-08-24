import { NamedUnionLeaf1 } from '../types/NamedUnionLeaf1'

export function isNamedUnionLeaf1(input: any): input is NamedUnionLeaf1 {
  return (
    input !== null &&
    typeof input === 'object' &&
    input.topLevelType === 'NamedUnionLeaf1' &&
    (input.namedUnionLeaf1Property === null ||
      input.namedUnionLeaf1Property === undefined ||
      typeof input.namedUnionLeaf1Property === 'string')
  )
}
