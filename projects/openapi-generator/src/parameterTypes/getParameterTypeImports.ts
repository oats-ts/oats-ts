import { ParameterLocation } from 'openapi3-ts'
import { getReferencedNamedSchemas } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'
import { getParameterSchemaObject } from './getParameterSchemaObject'
import { tsModelImportAsts } from '../common/typeScriptUtils'
import { ImportDeclaration } from 'typescript'

export function getParameterTypeImports(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const parameters = data[location]
  const { operation } = data

  const paramsSchema = getParameterSchemaObject(parameters)
  const path = accessor.path(operation, getParameterTypeGeneratorTarget(location))
  const referencedSchemas = getReferencedNamedSchemas(paramsSchema, context)

  return tsModelImportAsts(path, 'type', referencedSchemas, context)
}
