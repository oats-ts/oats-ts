import { OperationObject } from 'openapi3-ts'
import { factory, TypeReferenceNode } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getOperationReturnTypeReferenceAst(
  operation: OperationObject,
  context: OpenAPIGeneratorContext,
): TypeReferenceNode {
  const { nameOf } = context
  return factory.createTypeReferenceNode(nameOf(operation, 'openapi/response-type'))
}
