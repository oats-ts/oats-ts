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
import { entries, flatMap, values } from 'lodash'
import { collectSchemaImports } from '../collectSchemaImports'

export function generateResponseHeadersSerializer(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  if (!hasResponseHeaders(data.operation, context)) {
    return undefined
  }
  const { pathOf, dependenciesOf } = context
  const path = pathOf(data.operation, 'openapi/response-headers-serializer')
  const headersByStatus = getResponseHeaders(data.operation, context)
  const parameters = flatMap(values(headersByStatus), (headers) => values(headers))
  return {
    path: path,
    dependencies: [
      getNamedImports(RuntimePackages.ParameterSerialization.name, [
        RuntimePackages.ParameterSerialization.createHeaderSerializer,
        RuntimePackages.ParameterSerialization.serializers,
      ]),
      ...flatMap(entries(headersByStatus), ([statusCode]) =>
        dependenciesOf(path, [data.operation, statusCode], 'openapi/response-headers-type'),
      ),
      ...collectSchemaImports(path, parameters, context),
    ],
    content: [getResponseHeadersSerializerAst(data, context)],
  }
}
