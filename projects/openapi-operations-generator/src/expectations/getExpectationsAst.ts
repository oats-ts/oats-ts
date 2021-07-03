import { factory, NodeFlags, Statement, SyntaxKind } from 'typescript'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getExpectationsPropertyAsts } from './getExpectationsPropertyAsts'
import { OperationsGeneratorConfig } from '../typings'

export function getExpectationsAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): Statement {
  const { accessor } = context
  const { operation } = data

  const varName = accessor.name(operation, 'openapi/expectations')

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          varName,
          undefined,
          factory.createTypeReferenceNode(RuntimePackages.Http.ResponseExpectations),
          factory.createObjectLiteralExpression(getExpectationsPropertyAsts(data, context, config)),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
