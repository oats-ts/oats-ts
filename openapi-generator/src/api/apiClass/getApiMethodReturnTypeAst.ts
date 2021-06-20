import { factory, TypeReferenceNode } from 'typescript'
import { getOperationReturnTypeReferenceAst } from '../../operations/returnType/getReturnTypeReferenceAst'
import { EnhancedOperation } from '../../operations/typings'
import { OpenAPIGeneratorContext } from '../../typings'

export function getApiMethodReturnTypeAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeReferenceNode {
  return factory.createTypeReferenceNode('Promise', [getOperationReturnTypeReferenceAst(data.operation, context)])
}
