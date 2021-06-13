import { BabelModule } from '../../../../babel-writer/lib'
import { importAst } from '../../common/babelUtils'
import { Http } from '../../common/OatsPackages'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getResponseParserHintAst } from './getResponseParserHintAst'

export function generateResponseParserHint(data: EnhancedOperation, context: OpenAPIGeneratorContext): BabelModule {
  const { accessor } = context
  return {
    imports: [importAst(Http.name, [Http.ResponseParserHint])],
    path: accessor.path(data.operation, 'operation-response-parser-hint'),
    statements: [getResponseParserHintAst(data, context)],
  }
}
