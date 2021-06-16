import { TSType, tsTypeReference, identifier } from '@babel/types'
import { OperationObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'

export function getOperationReturnTypeReferenceAst(
  operation: OperationObject,
  context: OpenAPIGeneratorContext,
): TSType {
  const { accessor } = context
  return tsTypeReference(identifier(accessor.name(operation, 'operation-return-type')))
}
