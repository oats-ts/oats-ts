import { OperationObject } from 'openapi3-ts'
import { factory, TypeReferenceNode } from 'typescript'
import { OpenAPIGeneratorContext } from '../../typings'

export function getOperationReturnTypeReferenceAst(
  operation: OperationObject,
  context: OpenAPIGeneratorContext,
): TypeReferenceNode {
  const { accessor } = context
  return factory.createTypeReferenceNode(accessor.name(operation, 'operation-return-type'))
}
