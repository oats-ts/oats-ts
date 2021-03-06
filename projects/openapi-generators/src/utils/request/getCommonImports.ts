import { flatMap, isNil, negate, values } from 'lodash'
import { getRequestBodyContent } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'

export function getCommonImports(path: string, data: EnhancedOperation, context: OpenAPIGeneratorContext) {
  const bodies = values(getRequestBodyContent(data, context))
    .map(({ schema }) => schema)
    .filter(negate(isNil))

  const { dependenciesOf } = context
  const { operation } = data

  return [
    ...flatMap(bodies, (schema) => dependenciesOf(path, schema, 'json-schema/type')),
    ...dependenciesOf(path, operation, 'openapi/path-type'),
    ...dependenciesOf(path, operation, 'openapi/query-type'),
    ...dependenciesOf(path, operation, 'openapi/request-headers-type'),
  ]
}
