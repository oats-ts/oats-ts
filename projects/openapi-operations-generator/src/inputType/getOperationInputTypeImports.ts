import { entries, isNil, negate } from 'lodash'
import { ImportDeclaration } from 'typescript'
import { getReferencedNamedSchemas, getRequestBodyContent, hasInput } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getModelImports, getRelativeImports } from '@oats-ts/typescript-common'

export function getOperationInputTypeImports(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const { operation } = data
  const path = accessor.path(operation, 'operation-input-type')
  const bodies = entries(getRequestBodyContent(data, context))
  const referencedTypes = getReferencedNamedSchemas(
    { oneOf: bodies.map(([, { schema }]) => schema).filter(negate(isNil)) },
    context,
  )
  const parameterImports: [string, string][] = []
  if (data.path.length > 0) {
    parameterImports.push([
      accessor.path(operation, 'operation-path-type'),
      accessor.name(operation, 'operation-path-type'),
    ])
  }
  if (data.query.length > 0) {
    parameterImports.push([
      accessor.path(operation, 'operation-query-type'),
      accessor.name(operation, 'operation-query-type'),
    ])
  }
  if (data.header.length > 0) {
    parameterImports.push([
      accessor.path(operation, 'operation-headers-type'),
      accessor.name(operation, 'operation-headers-type'),
    ])
  }
  return [...getModelImports(path, 'type', referencedTypes, context), ...getRelativeImports(path, parameterImports)]
}
