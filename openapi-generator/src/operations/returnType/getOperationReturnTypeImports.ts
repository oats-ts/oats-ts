import { ImportDeclaration } from '@babel/types'
import { OperationObject, SchemaObject } from 'openapi3-ts'
import { createImportDeclarations } from '../../common/getImportDeclarations'
import { getReferencedNamedSchemas } from '../../common/getReferencedNamedSchemas'
import { OpenAPIGeneratorContext } from '../../typings'
import { getResponseSchemas } from './getResponseSchemas'

export function getOperationReturnTypeImports(
  operation: OperationObject,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const schemas = getResponseSchemas(operation, context)
  const wrapperSchema: SchemaObject = {
    oneOf: schemas,
  }
  const path = accessor.path(operation, 'operation-return-type')
  const referencedSchemas = getReferencedNamedSchemas(wrapperSchema, context)
  return createImportDeclarations(path, 'type', referencedSchemas, context)
}
