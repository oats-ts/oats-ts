import { flatMap } from 'lodash'
import { OpenAPIObject } from 'openapi3-ts'
import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'

export function getApiTypeImports(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const apiPath = accessor.path(doc, 'openapi/api-type')
  const imports = flatMap(operations, (data) => [
    ...accessor.dependencies(apiPath, data.operation, 'openapi/input-type'),
    ...accessor.dependencies(apiPath, data.operation, 'openapi/response-type'),
  ])
  return operations.length > 0
    ? [...imports, getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.RequestConfig])]
    : imports
}
