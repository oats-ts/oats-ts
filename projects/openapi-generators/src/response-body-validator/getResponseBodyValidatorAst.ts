import { factory, NodeFlags, Statement, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getResponseBodyValidatorPropertiesAst } from './getResponseBodyValidatorPropertiesAst'

export function getResponseBodyValidatorAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): Statement {
  const { operation } = data

  const varName = context.nameOf(operation, 'oats/response-body-validator')

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          varName,
          undefined,
          undefined,
          factory.createAsExpression(
            factory.createObjectLiteralExpression(getResponseBodyValidatorPropertiesAst(data, context)),
            factory.createTypeReferenceNode('const'),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
