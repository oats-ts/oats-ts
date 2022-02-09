import { flatMap, isNil, negate, values } from 'lodash'
import { getRequestBodyContent, RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getNamedImports } from '@oats-ts/typescript-common'

export function getCommonImports(path: string, data: EnhancedOperation, context: OpenAPIGeneratorContext) {
  const bodies = values(getRequestBodyContent(data, context))
    .map(({ schema }) => schema)
    .filter(negate(isNil))

  const { dependenciesOf } = context
  const { operation } = data

  return [
    getNamedImports(RuntimePackages.Http.name, [
      ...(bodies.length > 0 ? [RuntimePackages.Http.HasRequestBody] : []),
      ...(data.path.length > 0 ? [RuntimePackages.Http.HasPathParameters] : []),
      ...(data.query.length > 0 ? [RuntimePackages.Http.HasQueryParameters] : []),
      ...(data.header.length > 0 ? [RuntimePackages.Http.HasHeaders] : []),
    ]),
    ...flatMap(bodies, (schema) => dependenciesOf(path, schema, 'json-schema/type')),
    ...dependenciesOf(path, operation, 'openapi/path-type'),
    ...dependenciesOf(path, operation, 'openapi/query-type'),
    ...dependenciesOf(path, operation, 'openapi/request-headers-type'),
  ]
}
