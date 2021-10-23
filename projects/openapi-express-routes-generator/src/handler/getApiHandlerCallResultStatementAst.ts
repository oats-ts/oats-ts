import { factory, NodeFlags, SyntaxKind } from 'typescript'
import { Names } from './names'
import { EnhancedOperation, hasInput, hasRequestBody, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { isEmpty } from 'lodash'

export function getApiHandlerCallResultStatementAst(data: EnhancedOperation, context: OpenAPIGeneratorContext) {
  const { nameOf } = context
  const requestAst = factory.createObjectLiteralExpression(
    [
      ...(!isEmpty(data.path)
        ? [factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.path), undefined)]
        : []),
      ...(!isEmpty(data.query)
        ? [factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.query), undefined)]
        : []),
      ...(!isEmpty(data.header)
        ? [factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.headers), undefined)]
        : []),
      ...(hasRequestBody(data, context)
        ? [
            factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.mimeType), undefined),
            factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.body), undefined),
          ]
        : []),
      factory.createPropertyAssignment(
        factory.createIdentifier(Names.issues),
        factory.createConditionalExpression(
          factory.createBinaryExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(Names.issues),
              factory.createIdentifier('length'),
            ),
            factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
            factory.createNumericLiteral('0'),
          ),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createIdentifier('undefined'),
          factory.createToken(SyntaxKind.ColonToken),
          factory.createIdentifier(Names.issues),
        ),
      ),
    ],
    false,
  )

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(Names.handlerResult),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.api),
                factory.createIdentifier(nameOf(data.operation, 'openapi/operation')),
              ),
              undefined,
              [...(hasInput(data, context) ? [requestAst] : []), factory.createIdentifier(Names.expressParams)],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
