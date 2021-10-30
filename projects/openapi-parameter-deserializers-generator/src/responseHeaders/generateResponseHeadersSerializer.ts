import { hasResponseHeaders, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getNamedImports } from '@oats-ts/typescript-common'
import { getResponseHeadersSerializerAst } from './getResponseHeadersSerializerAst'

export function generateResponseHeadersSerializer(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  if (!hasResponseHeaders(data.operation, context)) {
    return undefined
  }
  const { pathOf } = context
  const serializerPath = pathOf(data.operation, 'openapi/response-headers-deserializer')
  const staticImports = getNamedImports(RuntimePackages.ParameterSerialization.name, [
    'header',
    RuntimePackages.ParameterDeserialization.createHeaderParser,
  ])
  return {
    path: serializerPath,
    dependencies: [staticImports],
    content: [getResponseHeadersSerializerAst(data, context)],
  }
}
