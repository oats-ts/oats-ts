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
  const { referenceOf, nameOf, document } = context
  const { ServerConfiguration } = RuntimePackages.HttpServer
  const { ExpressParameters } = RuntimePackages.HttpServerExpress

  const hasInputParams = hasInput(data, context)
  const hasPath = data.path.length > 0
  const hasQuery = data.query.length > 0
  const hasHeaders = data.header.length > 0
  const hasBody = hasRequestBody(data, context)

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

  const typedRequest = hasInputParams
    ? [
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier(Names.typedRequest),
                undefined,
                factory.createTypeReferenceNode(referenceOf(data.operation, 'openapi/request-server-type'), undefined),
                factory.createObjectLiteralExpression(
                  [
                    ...(hasPath
                      ? [factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.path), undefined)]
                      : []),
                    ...(hasQuery
                      ? [factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.query), undefined)]
                      : []),
                    ...(hasHeaders
                      ? [factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.headers), undefined)]
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
                  ],
                  true,
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
                nameOf(data.operation, 'openapi/operation'),
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

  const tryBlock = factory.createBlock(
    [...parameters, ...body, ...typedRequest, typedResponse, normalizedResponse, returnStatement],
    true,
  )

  const catchBlock = factory.createBlock(
    [
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(Names.configuration),
            factory.createIdentifier('handleError'),
          ),
          undefined,
          [factory.createIdentifier(Names.frameworkInput), factory.createIdentifier(Names.error)],
        ),
      ),
      factory.createThrowStatement(factory.createIdentifier(Names.error)),
    ],
    true,
  )

  const tryCatch = factory.createTryStatement(
    tryBlock,
    factory.createCatchClause(
      factory.createVariableDeclaration(factory.createIdentifier(Names.error), undefined, undefined, undefined),
      catchBlock,
    ),
    undefined,
  )

  return factory.createBlock([expressParams, configuration, api, tryCatch])
}
