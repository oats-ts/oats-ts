import { values } from 'lodash'
import { OperationObject, SchemaObject } from 'openapi3-ts'
import { ImportDeclaration } from 'typescript'
import { getReferencedNamedSchemas } from '../../common/getReferencedNamedSchemas'
import { tsModelImportAsts } from '../../common/typeScriptUtils'
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
  const path = accessor.path(operation, 'operation-response-type')
  const referencedSchemas = getReferencedNamedSchemas(wrapperSchema, context)
  return tsModelImportAsts(path, 'type', referencedSchemas, context)
}
