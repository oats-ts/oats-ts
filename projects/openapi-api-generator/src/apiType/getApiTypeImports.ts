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
  const { dependenciesOf, pathOf } = context
  const apiPath = pathOf(doc, 'openapi/api-type')
  const imports = flatMap(operations, (data) => [
    ...dependenciesOf(apiPath, data.operation, 'openapi/input-type'),
    ...dependenciesOf(apiPath, data.operation, 'openapi/response-type'),
  ])
  return operations.length > 0
    ? [...imports, getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.RequestConfig])]
    : imports
}
