import { factory, TypeReferenceNode } from 'typescript'
import { getOperationReturnTypeReferenceAst } from '../../operations/returnType/getReturnTypeReferenceAst'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getApiMethodReturnTypeAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeReferenceNode {
  return factory.createTypeReferenceNode('Promise', [getOperationReturnTypeReferenceAst(data.operation, context)])
}
