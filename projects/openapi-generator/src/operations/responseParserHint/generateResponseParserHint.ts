import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getResponseParserHintAst } from './getResponseParserHintAst'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateResponseParserHint(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  const { accessor } = context
  return {
    path: accessor.path(data.operation, 'operation-response-parser-hint'),
    dependencies: [getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.ResponseParserHint])],
    content: [getResponseParserHintAst(data, context)],
  }
}
