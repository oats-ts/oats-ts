import { values, isNil, negate, flatMap } from 'lodash'
import { ImportDeclaration } from 'typescript'
import { getRequestBodyContent } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'

export function getOperationInputTypeImports(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const { operation } = data
  const path = accessor.path(operation, 'operation-input-type')
  const bodySchemas = values(getRequestBodyContent(data, context))
    .map(({ schema }) => schema)
    .filter(negate(isNil))
  return [
    ...flatMap(bodySchemas, (schema) => accessor.dependencies(path, schema, 'type')),
    ...accessor.dependencies(path, operation, 'operation-path-type'),
    ...accessor.dependencies(path, operation, 'operation-query-type'),
    ...accessor.dependencies(path, operation, 'operation-headers-type'),
  ]
}
