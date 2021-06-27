import { factory, TypeReferenceNode } from 'typescript'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getApiMethodReturnTypeAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeReferenceNode {
  const { accessor } = context
  return factory.createTypeReferenceNode('Promise', [
    factory.createTypeReferenceNode(accessor.name(data.operation, 'operation-response-type')),
  ])
}
