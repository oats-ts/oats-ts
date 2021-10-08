import { factory, TypeReferenceNode } from 'typescript'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getApiMethodReturnTypeAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeReferenceNode {
  const { nameOf } = context
  return factory.createTypeReferenceNode('Promise', [
    factory.createTypeReferenceNode(nameOf(data.operation, 'openapi/response-type')),
  ])
}
