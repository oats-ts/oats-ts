import { ParameterLocation } from '@oats-ts/openapi-model'
import { flatMap } from 'lodash'
import { getReferencedNamedSchemas } from '@oats-ts/model-common'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'
import { getParameterSchemaObject } from './getParameterSchemaObject'
import { ImportDeclaration } from 'typescript'

export function getParameterTypeImports(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { pathOf, dependenciesOf } = context
  const parameters = data[location]
  const { operation } = data
  const path = pathOf(operation, getParameterTypeGeneratorTarget(location))
  const referencedSchemas = getReferencedNamedSchemas(getParameterSchemaObject(parameters, context), context)
  return flatMap(referencedSchemas, (schema) => dependenciesOf(path, schema, 'json-schema/type'))
}
