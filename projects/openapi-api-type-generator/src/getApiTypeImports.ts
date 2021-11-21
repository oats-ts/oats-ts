import { flatMap } from 'lodash'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'

export function getApiTypeImports(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  params: boolean,
): ImportDeclaration[] {
  const { dependenciesOf, pathOf } = context
  const apiPath = pathOf(doc, 'openapi/api-type')
  return flatMap(operations, (data) => [
    ...(params ? dependenciesOf(apiPath, data.operation, 'openapi/request-server-type') : []),
    ...dependenciesOf(apiPath, data.operation, 'openapi/response-type'),
  ])
}
