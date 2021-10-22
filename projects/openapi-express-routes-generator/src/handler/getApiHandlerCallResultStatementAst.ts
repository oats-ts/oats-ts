import { factory, NodeFlags } from 'typescript'
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
        factory.createArrayLiteralExpression(
          [
            ...(!isEmpty(data.path) ? [factory.createSpreadElement(factory.createIdentifier(Names.pathIssues))] : []),
            ...(!isEmpty(data.query) ? [factory.createSpreadElement(factory.createIdentifier(Names.queryIssues))] : []),
            ...(!isEmpty(data.header)
              ? [factory.createSpreadElement(factory.createIdentifier(Names.headerIssues))]
              : []),
            ...(hasRequestBody(data, context)
              ? [factory.createSpreadElement(factory.createIdentifier(Names.bodyIssues))]
              : []),
          ],
          false,
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
