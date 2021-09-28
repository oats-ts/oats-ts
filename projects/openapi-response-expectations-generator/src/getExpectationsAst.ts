import { factory, NodeFlags, Statement, SyntaxKind } from 'typescript'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getExpectationsPropertyAsts } from './getExpectationsPropertyAsts'

export function getExpectationsAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): Statement {
  const { nameOf } = context
  const { operation } = data

  const varName = nameOf(operation, 'openapi/expectations')

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          varName,
          undefined,
          factory.createTypeReferenceNode(RuntimePackages.Http.ResponseExpectations),
          factory.createObjectLiteralExpression(getExpectationsPropertyAsts(data, context)),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
