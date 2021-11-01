import {
  getResponseHeaders,
  hasResponseHeaders,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getNamedImports } from '@oats-ts/typescript-common'
import { getResponseHeadersDeserializerAst } from './getResponseHeadersDeserializerAst'
import { entries, flatMap } from 'lodash'

export function generateResponseHeadersDeserializer(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  if (!hasResponseHeaders(data.operation, context)) {
    return undefined
  }
  const { pathOf, dependenciesOf } = context
  const path = pathOf(data.operation, 'openapi/response-headers-deserializer')
  return {
    path: path,
    dependencies: [
      getNamedImports(RuntimePackages.ParameterSerialization.name, [
        'header',
        RuntimePackages.ParameterDeserialization.createHeaderParser,
      ]),
      ...flatMap(entries(getResponseHeaders(data.operation, context)), ([statusCode]) =>
        dependenciesOf(path, [data.operation, statusCode], 'openapi/response-headers-type'),
      ),
    ],
    content: [getResponseHeadersDeserializerAst(data, context)],
  }
}
