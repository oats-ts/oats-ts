import { isNil } from 'lodash'
import { isIdentifier, isToken, isTypeReferenceNode, SyntaxKind, TypeNode } from 'typescript'

export function isVoidType(type: TypeNode): boolean {
  if (isNil(type)) {
    return false
  }
  if (isTypeReferenceNode(type)) {
    return isIdentifier(type.typeName) && type.typeName.escapedText === 'void'
  }
  if (isToken(type)) {
    return type.kind === SyntaxKind.VoidKeyword
  }
  return false
}
