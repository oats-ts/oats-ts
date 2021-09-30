import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { values, negate, isNil, flatMap } from 'lodash'
import { getRequestBodyContent, hasInput, RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getRequestTypeAst } from './getRequestTypeAst'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateRequestType(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeScriptModule {
  if (!hasInput(data, context)) {
    return undefined
  }

  const { pathOf, dependenciesOf } = context
  const { operation } = data

  const path = pathOf(operation, 'openapi/request-type')
  const bodies = values(getRequestBodyContent(data, context))
    .map(({ schema }) => schema)
    .filter(negate(isNil))
  const ast = getRequestTypeAst(data, context)
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.Http.name, [
        ...(bodies.length > 0 ? [RuntimePackages.Http.HasRequestBody] : []),
        ...(data.path.length > 0 ? [RuntimePackages.Http.HasPathParameters] : []),
        ...(data.query.length > 0 ? [RuntimePackages.Http.HasQueryParameters] : []),
        ...(data.header.length > 0 ? [RuntimePackages.Http.HasHeaders] : []),
      ]),
      ...flatMap(bodies, (schema) => dependenciesOf(path, schema, 'openapi/type')),
      ...dependenciesOf(path, operation, 'openapi/path-type'),
      ...dependenciesOf(path, operation, 'openapi/query-type'),
      ...dependenciesOf(path, operation, 'openapi/headers-type'),
    ],
    content: isNil(ast) ? [] : [ast],
  }
}
