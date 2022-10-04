import { factory, NodeFlags, Statement, SyntaxKind } from 'typescript'
import { getRequestBodyContent, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getContentTypeBasedValidatorsAst } from '../utils/getContentTypeBasedValidatorsAst'

export function getRequestBodyValidatorAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): Statement {
  const { operation } = data
  const body = context.dereference(data.operation.requestBody)

  const varName = context.nameOf(operation, 'oats/request-body-validator')

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          varName,
          undefined,
          undefined,
          factory.createAsExpression(
            factory.createObjectLiteralExpression(
              getContentTypeBasedValidatorsAst(Boolean(body?.required), getRequestBodyContent(data, context), context),
            ),
            factory.createTypeReferenceNode('const'),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
