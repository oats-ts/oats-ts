import {
  EnhancedOperation,
  getResponseHeaders,
  hasResponses,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { flatMap, isNil, keys, negate, values } from 'lodash'
import { factory, NodeFlags, Statement, SyntaxKind } from 'typescript'

export function getCorsMiddlewareAst(operations: EnhancedOperation[], context: OpenAPIGeneratorContext): Statement {
  const { nameOf, document } = context
  const hasAnyResponses = operations.some(({ operation }) => hasResponses(operation, context))
  const methods = Array.from(new Set(operations.map(({ method }) => method.toUpperCase())))
  const responseHeaders = Array.from(
    new Set([
      ...flatMap(operations, ({ operation }) =>
        flatMap(values(getResponseHeaders(operation, context)), (headers) =>
          keys(headers).map((header) => header.toLowerCase()),
        ),
      ),
      ...(hasAnyResponses ? ['content-type'] : []),
    ]),
  )
  const hasCookies = operations.some(({ cookie }) => cookie.length > 0)

  const corsOrigin = factory.createExpressionStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createIdentifier('response'),
        factory.createIdentifier('setHeader'),
      ),
      undefined,
      [
        factory.createStringLiteral('Access-Control-Allow-Origin'),
        factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier('request'),
            factory.createIdentifier('headers'),
          ),
          factory.createIdentifier('origin'),
        ),
      ],
    ),
  )

  const corsMethods =
    methods.length > 0
      ? factory.createExpressionStatement(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('response'),
              factory.createIdentifier('setHeader'),
            ),
            undefined,
            [
              factory.createStringLiteral('Access-Control-Allow-Methods'),
              factory.createStringLiteral(methods.join(', ')),
            ],
          ),
        )
      : undefined

  const corsAllowedHeaders =
    responseHeaders.length > 0
      ? factory.createExpressionStatement(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('response'),
              factory.createIdentifier('setHeader'),
            ),
            undefined,
            [
              factory.createStringLiteral('Access-Control-Allow-Headers'),
              factory.createStringLiteral(responseHeaders.join(', ')),
            ],
          ),
        )
      : undefined

  const corsCreds = hasCookies
    ? factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier('response'),
            factory.createIdentifier('setHeader'),
          ),
          undefined,
          [factory.createStringLiteral('Access-Control-Allow-Credentials'), factory.createStringLiteral('true')],
        ),
      )
    : undefined

  const corsHeaderStatements = [corsOrigin, corsMethods, corsAllowedHeaders, corsCreds].filter(negate(isNil))

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(nameOf(document, 'openapi/express-cors-middleware')),
          undefined,
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                factory.createToken(SyntaxKind.DotDotDotToken),
                factory.createIdentifier('origins'),
                undefined,
                factory.createArrayTypeNode(factory.createKeywordTypeNode(SyntaxKind.StringKeyword)),
                undefined,
              ),
            ],
            factory.createTypeReferenceNode(
              factory.createIdentifier(RuntimePackages.Express.RequestHandler),
              undefined,
            ),
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createArrowFunction(
              undefined,
              undefined,
              [
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('request'),
                  undefined,
                  factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.Request), undefined),
                  undefined,
                ),
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('response'),
                  undefined,
                  factory.createTypeReferenceNode(
                    factory.createIdentifier(RuntimePackages.Express.Response),
                    undefined,
                  ),
                  undefined,
                ),
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('next'),
                  undefined,
                  factory.createTypeReferenceNode(
                    factory.createIdentifier(RuntimePackages.Express.NextFunction),
                    undefined,
                  ),
                  undefined,
                ),
              ],
              undefined,
              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
              factory.createBlock(
                [
                  factory.createIfStatement(
                    factory.createBinaryExpression(
                      factory.createBinaryExpression(
                        factory.createTypeOfExpression(
                          factory.createPropertyAccessExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier('request'),
                              factory.createIdentifier('headers'),
                            ),
                            factory.createIdentifier('origin'),
                          ),
                        ),
                        factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
                        factory.createStringLiteral('string'),
                      ),
                      factory.createToken(SyntaxKind.AmpersandAmpersandToken),
                      factory.createParenthesizedExpression(
                        factory.createBinaryExpression(
                          factory.createBinaryExpression(
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier('origins'),
                                factory.createIdentifier('indexOf'),
                              ),
                              undefined,
                              [
                                factory.createPropertyAccessExpression(
                                  factory.createPropertyAccessExpression(
                                    factory.createIdentifier('request'),
                                    factory.createIdentifier('headers'),
                                  ),
                                  factory.createIdentifier('origin'),
                                ),
                              ],
                            ),
                            factory.createToken(SyntaxKind.GreaterThanEqualsToken),
                            factory.createNumericLiteral('0'),
                          ),
                          factory.createToken(SyntaxKind.BarBarToken),
                          factory.createBinaryExpression(
                            factory.createCallExpression(
                              factory.createPropertyAccessExpression(
                                factory.createIdentifier('origins'),
                                factory.createIdentifier('indexOf'),
                              ),
                              undefined,
                              [factory.createStringLiteral('*')],
                            ),
                            factory.createToken(SyntaxKind.GreaterThanEqualsToken),
                            factory.createNumericLiteral('0'),
                          ),
                        ),
                      ),
                    ),
                    factory.createBlock(corsHeaderStatements, true),
                    undefined,
                  ),
                  factory.createExpressionStatement(
                    factory.createCallExpression(factory.createIdentifier('next'), undefined, []),
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