import {
  EnhancedOperation,
  hasInput,
  hasRequestBody,
  hasResponseHeaders,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { factory, NodeFlags, SyntaxKind } from 'typescript'
import { ExpressRouteGeneratorConfig } from './typings'
import { Names } from './Names'
import { getParametersStatementAst } from './getParametersStatementAst'
import { getRequestBodyRelatedStatementAsts } from './getRequestBodyRelatedStatementAsts'

export function getHandlerBodyAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRouteGeneratorConfig,
) {
  const { referenceOf, document } = context
  const { ServerConfiguration } = RuntimePackages.HttpServer
  const { ExpressParameters } = RuntimePackages.HttpServerExpress

  const hasInputParams = hasInput(data, context)
  const hasPath = data.path.length > 0
  const hasQuery = data.query.length > 0
  const hasHeaders = data.header.length > 0
  const hasBody = hasRequestBody(data, context)
  const hasRespHeaders = hasResponseHeaders(data.operation, context)

  const expressParams = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(Names.frameworkInput),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(ExpressParameters), undefined),
          factory.createObjectLiteralExpression(
            [
              factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.request), undefined),
              factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.response), undefined),
              factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.next), undefined),
            ],
            false,
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )

  const configuration = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(Names.configuration),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(ServerConfiguration), [
            factory.createTypeReferenceNode(factory.createIdentifier(ExpressParameters), undefined),
          ]),
          factory.createElementAccessExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(Names.response),
              factory.createIdentifier(Names.locals),
            ),
            factory.createStringLiteral(config.configurationKey),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )

  const api = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(Names.api),
          undefined,
          factory.createTypeReferenceNode(referenceOf(document, 'openapi/api-type'), [
            factory.createTypeReferenceNode(factory.createIdentifier(ExpressParameters), undefined),
          ]),
          factory.createElementAccessExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(Names.response),
              factory.createIdentifier(Names.locals),
            ),
            factory.createStringLiteral(config.apiImplKey),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )

  const parameters = [
    ...getParametersStatementAst('path', data, context),
    ...getParametersStatementAst('query', data, context),
    ...getParametersStatementAst('header', data, context),
  ]

  const body = getRequestBodyRelatedStatementAsts(data, context)

  const issues = hasInputParams
    ? [
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier(Names.issues),
                undefined,
                undefined,
                factory.createArrayLiteralExpression(
                  [
                    ...(data.path.length > 0
                      ? [factory.createSpreadElement(factory.createIdentifier(Names.pathIssues))]
                      : []),
                    ...(data.query.length > 0
                      ? [factory.createSpreadElement(factory.createIdentifier(Names.queryIssues))]
                      : []),
                    ...(data.header.length > 0
                      ? [factory.createSpreadElement(factory.createIdentifier(Names.headerIssues))]
                      : []),
                    ...(hasRequestBody(data, context)
                      ? [
                          factory.createSpreadElement(factory.createIdentifier(Names.mimeTypeIssues)),
                          factory.createSpreadElement(factory.createIdentifier(Names.bodyIssues)),
                        ]
                      : []),
                  ],
                  false,
                ),
              ),
            ],
            NodeFlags.Const,
          ),
        ),
      ]
    : []

  const typedRequest = hasInputParams
    ? [
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier(Names.typedRequest),
                undefined,
                undefined,
                factory.createAsExpression(
                  factory.createObjectLiteralExpression(
                    [
                      ...(hasPath
                        ? [factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.path), undefined)]
                        : []),
                      ...(hasQuery
                        ? [factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.query), undefined)]
                        : []),
                      ...(hasHeaders
                        ? [
                            factory.createShorthandPropertyAssignment(
                              factory.createIdentifier(Names.headers),
                              undefined,
                            ),
                          ]
                        : []),
                      ...(hasBody
                        ? [
                            factory.createShorthandPropertyAssignment(
                              factory.createIdentifier(Names.mimeType),
                              undefined,
                            ),
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
                            factory.createToken(SyntaxKind.GreaterThanToken),
                            factory.createNumericLiteral('0'),
                          ),
                          factory.createToken(SyntaxKind.QuestionToken),
                          factory.createIdentifier(Names.issues),
                          factory.createToken(SyntaxKind.ColonToken),
                          factory.createIdentifier('undefined'),
                        ),
                      ),
                    ],
                    true,
                  ),
                  factory.createTypeReferenceNode(
                    referenceOf(data.operation, 'openapi/request-server-type'),
                    undefined,
                  ),
                ),
              ),
            ],
            NodeFlags.Const,
          ),
        ),
      ]
    : []

  const typedResponse = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(Names.typedResponse),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.api),
                referenceOf(data.operation, 'openapi/operation'),
              ),
              undefined,
              [
                ...(hasInputParams ? [factory.createIdentifier(Names.typedRequest)] : []),
                factory.createIdentifier(Names.frameworkInput),
              ],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
  const normalizedResponse = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(Names.rawResponse),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Http.RawHttpResponse), undefined),
          factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(
                factory.createIdentifier(Names.headers),
                factory.createAwaitExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(Names.configuration),
                      factory.createIdentifier('getResponseHeaders'),
                    ),
                    undefined,
                    [
                      factory.createIdentifier(Names.frameworkInput),
                      factory.createIdentifier(Names.typedResponse),
                      referenceOf(data.operation, 'openapi/response-headers-serializer') ||
                        factory.createIdentifier('undefined'),
                    ],
                  ),
                ),
              ),
              factory.createPropertyAssignment(
                factory.createIdentifier(Names.statusCode),
                factory.createAwaitExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(Names.configuration),
                      factory.createIdentifier('getStatusCode'),
                    ),
                    undefined,
                    [factory.createIdentifier(Names.frameworkInput), factory.createIdentifier(Names.typedResponse)],
                  ),
                ),
              ),
              factory.createPropertyAssignment(
                factory.createIdentifier(Names.body),
                factory.createAwaitExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(Names.configuration),
                      factory.createIdentifier('getResponseBody'),
                    ),
                    undefined,
                    [factory.createIdentifier(Names.frameworkInput), factory.createIdentifier(Names.typedResponse)],
                  ),
                ),
              ),
            ],
            true,
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
  const returnStatement = factory.createReturnStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createIdentifier(Names.configuration),
        factory.createIdentifier('respond'),
      ),
      undefined,
      [factory.createIdentifier(Names.frameworkInput), factory.createIdentifier(Names.rawResponse)],
    ),
  )

  return factory.createBlock([
    expressParams,
    configuration,
    api,
    ...parameters,
    ...body,
    ...issues,
    ...typedRequest,
    typedResponse,
    normalizedResponse,
    returnStatement,
  ])
}
