import { factory, NodeFlags, Statement, SyntaxKind } from 'typescript'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getResponseParserHintPropertyAsts } from './getResponseParserHintPropertyAsts'
import { OperationsGeneratorConfig } from '../typings'

export function getResponseParserHintAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): Statement {
  const { accessor } = context
  const { operation } = data

  const varName = accessor.name(operation, 'operation-response-parser-hint')

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          varName,
          undefined,
          factory.createTypeReferenceNode(RuntimePackages.Http.ResponseParserHint),
          factory.createObjectLiteralExpression(getResponseParserHintPropertyAsts(data, context, config)),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
