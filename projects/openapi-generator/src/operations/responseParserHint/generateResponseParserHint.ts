import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { Http } from '../../common/OatsPackages'
import { tsImportAst } from '../../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getResponseParserHintAst } from './getResponseParserHintAst'

export function generateResponseParserHint(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  const { accessor } = context
  return {
    path: accessor.path(data.operation, 'operation-response-parser-hint'),
    dependencies: [tsImportAst(Http.name, [Http.ResponseParserHint])],
    content: [getResponseParserHintAst(data, context)],
  }
}
