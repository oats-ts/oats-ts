import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { flatMap, isNil } from 'lodash'
import { ExpressionStatement, factory, NodeFlags, Statement, SyntaxKind } from 'typescript'
import { getExpressRouterHandlerParameters } from '../express-router/getExpressRouterHandlerParameters'
import { AccessControlHeaders } from '../utils/AccessControlHeaders'
import { getAllRequestHeaders } from '../utils/getAllRequestHeaders'
import { getAllResponseHeaders } from '../utils/getAllResponseHeaders'
import { getSetHeaderAst } from '../utils/getSetHeaderAst'
import { RouterNames } from '../utils/RouterNames'

export function getCorsMiddlewareAst(operations: EnhancedOperation[], context: OpenAPIGeneratorContext): Statement {
  const { nameOf, document } = context
  const methods = Array.from(new Set(operations.map(({ method }) => method.toUpperCase())))
  const requestHeaders = Array.from(new Set(flatMap(operations, ({ parent }) => getAllRequestHeaders(parent, context))))
  const responseHeaders = Array.from(
    new Set(flatMap(operations, ({ parent }) => getAllResponseHeaders(parent, context))),
  )
  const matcherFnName = factory.createIdentifier('isAccepted')

  const matcherFnParam = factory.createParameterDeclaration(
    undefined,
    undefined,
    undefined,
    matcherFnName,
    undefined,
    factory.createFunctionTypeNode(
      undefined,
      [
        factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier(RouterNames.request),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Request), undefined),
          undefined,
        ),
      ],
      factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
    ),
    undefined,
  )

  const originAst = factory.createBinaryExpression(
    factory.createPropertyAccessExpression(
      factory.createPropertyAccessExpression(
        factory.createIdentifier(RouterNames.request),
        factory.createIdentifier(RouterNames.headers),
      ),
      factory.createIdentifier(RouterNames.origin),
    ),
    factory.createToken(SyntaxKind.QuestionQuestionToken),
    factory.createStringLiteral('*'),
  )

  const corsOrigin = getSetHeaderAst(AccessControlHeaders.AllowOrigin, originAst)

  const corsMethods =
    methods.length > 0
      ? getSetHeaderAst(AccessControlHeaders.AllowMethods, factory.createStringLiteral(methods.join(', ')))
      : undefined

  const corsExposeHeaders =
    responseHeaders.length > 0
      ? getSetHeaderAst(AccessControlHeaders.ExposeHeaders, factory.createStringLiteral(responseHeaders.join(', ')))
      : undefined

  const corsAllowedHeaders =
    requestHeaders.length > 0
      ? getSetHeaderAst(AccessControlHeaders.AllowHeaders, factory.createStringLiteral(requestHeaders.join(', ')))
      : undefined

  const corsHeaderStatements = [corsOrigin, corsMethods, corsAllowedHeaders, corsExposeHeaders].filter(
    (statement): statement is ExpressionStatement => !isNil(statement),
  )

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(nameOf(document, 'oats/express-cors-middleware')),
          undefined,
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            [matcherFnParam],
            factory.createTypeReferenceNode(
              factory.createIdentifier(RuntimePackages.Express.RequestHandler),
              undefined,
            ),
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createArrowFunction(
              undefined,
              undefined,
              getExpressRouterHandlerParameters(),
              undefined,
              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
              factory.createBlock(
                [
                  factory.createIfStatement(
                    factory.createCallExpression(matcherFnName, undefined, [
                      factory.createIdentifier(RouterNames.request),
                    ]),
                    factory.createBlock(corsHeaderStatements, true),
                    undefined,
                  ),
                  factory.createExpressionStatement(
                    factory.createCallExpression(factory.createIdentifier(RouterNames.next), undefined, []),
                  ),
                ],
                true,
              ),
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
