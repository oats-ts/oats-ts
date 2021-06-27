import { values } from 'lodash'
import { OperationObject, SchemaObject } from 'openapi3-ts'
import { ImportDeclaration } from 'typescript'
import { getReferencedNamedSchemas } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getResponseMap } from './getResponseMap'
import { getModelImports } from '@oats-ts/typescript-common'

export function getOperationReturnTypeImports(
  operation: OperationObject,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const schemas = getResponseMap(operation, context)
  const wrapperSchema: SchemaObject = {
    oneOf: values(schemas),
  }
  const path = accessor.path(operation, 'operation-response-type')
  const referencedSchemas = getReferencedNamedSchemas(wrapperSchema, context)
  return getModelImports(path, 'type', referencedSchemas, context)
}
