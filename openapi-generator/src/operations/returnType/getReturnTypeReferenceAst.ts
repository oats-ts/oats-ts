import { TSType, tsVoidKeyword, tsTypeReference, identifier } from '@babel/types'
import { OperationObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { getTypeReferenceAst } from '../../schemas/types/getTypeReferenceAst'
import { getResponseSchemas } from './getResponseSchemas'
import { isReturnTypeRequired } from './isReturnTypeRequired'

export function getOperationReturnTypeReferenceAst(
  operation: OperationObject,
  context: OpenAPIGeneratorContext,
): TSType {
  const { accessor } = context
  const schemas = getResponseSchemas(operation, context)
  if (!isReturnTypeRequired(schemas, context)) {
    switch (schemas.length) {
      case 0:
        return tsVoidKeyword()
      case 1:
        return getTypeReferenceAst(schemas[0], context)
    }
  }
  return tsTypeReference(identifier(accessor.name(operation, 'operation-return-type')))
}
