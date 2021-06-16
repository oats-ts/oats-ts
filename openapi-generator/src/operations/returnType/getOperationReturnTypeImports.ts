import { ImportDeclaration } from '@babel/types'
import { values } from 'lodash'
import { OperationObject, SchemaObject } from 'openapi3-ts'
import { getImportDeclarations } from '../../common/getImportDeclarations'
import { getReferencedNamedSchemas } from '../../common/getReferencedNamedSchemas'
import { OpenAPIGeneratorContext } from '../../typings'
import { getResponseMap } from './getResponseMap'

export function getOperationReturnTypeImports(
  operation: OperationObject,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const schemas = getResponseMap(operation, context)
  const wrapperSchema: SchemaObject = {
    oneOf: values(schemas),
  }
  const path = accessor.path(operation, 'operation-return-type')
  const referencedSchemas = getReferencedNamedSchemas(wrapperSchema, context)
  return getImportDeclarations(path, 'type', referencedSchemas, context)
}
