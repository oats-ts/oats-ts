import { factory, NodeFlags, Statement } from 'typescript'
import { Http } from '../../common/OatsPackages'
import { tsExportModifier } from '../../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getResponseParserHintPropertyAsts } from './getResponseParserHintPropertyAsts'

export function getResponseParserHintAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): Statement {
  const { accessor } = context
  const { operation } = data

  const varName = accessor.name(operation, 'operation-response-parser-hint')

  return factory.createVariableStatement(
    [tsExportModifier()],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          varName,
          undefined,
          factory.createTypeReferenceNode(Http.ResponseParserHint),
          factory.createObjectLiteralExpression(getResponseParserHintPropertyAsts(data, context)),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
