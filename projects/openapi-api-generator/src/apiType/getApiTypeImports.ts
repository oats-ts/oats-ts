import { flatMap } from 'lodash'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'

export function getApiTypeImports(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  params: boolean,
): ImportDeclaration[] {
  const { dependenciesOf, pathOf } = context
  const apiPath = pathOf(doc, 'openapi/api-type')
  const imports = flatMap(operations, (data) => [
    ...(params ? dependenciesOf(apiPath, data.operation, 'openapi/request-type') : []),
    ...dependenciesOf(apiPath, data.operation, 'openapi/response-type'),
  ])
  return operations.length > 0
    ? [
        ...imports,
        ...(params ? [getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.RequestConfig])] : []),
      ]
    : imports
}
