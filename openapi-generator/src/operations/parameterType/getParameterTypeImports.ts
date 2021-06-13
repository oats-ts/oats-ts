import { ImportDeclaration } from '@babel/types'
import { ParameterLocation } from 'openapi3-ts'
import { createImportDeclarations } from '../../common/getImportDeclarations'
import { getReferencedNamedSchemas } from '../../common/getReferencedNamedSchemas'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'
import { getParameterSchemaObject } from './getParameterSchemaObject'

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

  return createImportDeclarations(path, 'type', referencedSchemas, context)
}
