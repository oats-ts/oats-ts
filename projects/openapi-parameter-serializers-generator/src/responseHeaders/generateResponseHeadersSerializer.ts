import {
  getResponseHeaders,
  hasResponseHeaders,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getNamedImports } from '@oats-ts/typescript-common'
import { getResponseHeadersSerializerAst } from './getResponseHeadersSerializerAst'
import { entries, flatMap } from 'lodash'

export function generateResponseHeadersSerializer(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  if (!hasResponseHeaders(data.operation, context)) {
    return undefined
  }
  const { pathOf, dependenciesOf } = context
  const path = pathOf(data.operation, 'openapi/response-headers-serializer')
  return {
    path: path,
    dependencies: [
      getNamedImports(RuntimePackages.ParameterSerialization.name, [
        RuntimePackages.ParameterSerialization.createHeaderSerializer,
        RuntimePackages.ParameterSerialization.serializers,
      ]),
      ...flatMap(entries(getResponseHeaders(data.operation, context)), ([statusCode]) =>
        dependenciesOf(path, [data.operation, statusCode], 'openapi/response-headers-type'),
      ),
    ],
    content: [getResponseHeadersSerializerAst(data, context)],
  }
}
