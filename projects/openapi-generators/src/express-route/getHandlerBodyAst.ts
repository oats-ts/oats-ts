import {
  EnhancedOperation,
  hasInput,
  hasRequestBody,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { factory, NodeFlags } from 'typescript'
import { ExpressRoutesGeneratorConfig } from './typings'
import { getParametersStatementAst } from './getParametersStatementAst'
import { getRequestBodyRelatedStatementAsts } from './getRequestBodyRelatedStatementAsts'
import { RouterNames } from '../utils/RouterNames'

export function getHandlerBodyAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutesGeneratorConfig,
) {
  const { referenceOf, nameOf, document } = context
  const { ExpressToolkit: ExpressParameters } = RuntimePackages.HttpServerExpress

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
          factory.createIdentifier(RouterNames.toolkit),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(ExpressParameters), undefined),
          factory.createObjectLiteralExpression(
            [
              factory.createShorthandPropertyAssignment(factory.createIdentifier(RouterNames.request), undefined),
              factory.createShorthandPropertyAssignment(factory.createIdentifier(RouterNames.response), undefined),
              factory.createShorthandPropertyAssignment(factory.createIdentifier(RouterNames.next), undefined),
            ],
            false,
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )

  const adapter = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(RouterNames.adapter),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Http.ServerAdapter), [
            factory.createTypeReferenceNode(factory.createIdentifier(ExpressParameters), undefined),
          ]),
          factory.createElementAccessExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(RouterNames.response),
              factory.createIdentifier(RouterNames.locals),
            ),
            factory.createStringLiteral(config.adapterKey),
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
          factory.createIdentifier(RouterNames.api),
          undefined,
          factory.createTypeReferenceNode(referenceOf(document, 'oats/api-type')),
          factory.createElementAccessExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(RouterNames.response),
              factory.createIdentifier(RouterNames.locals),
            ),
            factory.createStringLiteral(config.apiKey),
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
                factory.createIdentifier(RouterNames.typedRequest),
                undefined,
                factory.createTypeReferenceNode(referenceOf(data.operation, 'oats/request-server-type'), undefined),
                factory.createObjectLiteralExpression(
                  [
                    ...(hasPath
                      ? [
                          factory.createShorthandPropertyAssignment(
                            factory.createIdentifier(RouterNames.path),
                            undefined,
                          ),
                        ]
                      : []),
                    ...(hasQuery
                      ? [
                          factory.createShorthandPropertyAssignment(
                            factory.createIdentifier(RouterNames.query),
                            undefined,
                          ),
                        ]
                      : []),
                    ...(hasHeaders
                      ? [
                          factory.createShorthandPropertyAssignment(
                            factory.createIdentifier(RouterNames.headers),
                            undefined,
                          ),
                        ]
                      : []),
                    ...(hasBody
                      ? [
                          factory.createShorthandPropertyAssignment(
                            factory.createIdentifier(RouterNames.mimeType),
                            undefined,
                          ),
                          factory.createShorthandPropertyAssignment(
                            factory.createIdentifier(RouterNames.body),
                            undefined,
                          ),
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
          factory.createIdentifier(RouterNames.typedResponse),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(RouterNames.api),
                nameOf(data.operation, 'oats/operation'),
              ),
              undefined,
              hasInputParams ? [factory.createIdentifier(RouterNames.typedRequest)] : [],
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
          factory.createIdentifier(RouterNames.rawResponse),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Http.RawHttpResponse), undefined),
          factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(
                factory.createIdentifier(RouterNames.headers),
                factory.createAwaitExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(RouterNames.adapter),
                      factory.createIdentifier('getResponseHeaders'),
                    ),
                    undefined,
                    [
                      factory.createIdentifier(RouterNames.toolkit),
                      factory.createIdentifier(RouterNames.typedResponse),
                      referenceOf(data.operation, 'oats/response-headers-serializer') ||
                        factory.createIdentifier('undefined'),
                    ],
                  ),
                ),
              ),
              factory.createPropertyAssignment(
                factory.createIdentifier(RouterNames.statusCode),
                factory.createAwaitExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(RouterNames.adapter),
                      factory.createIdentifier('getStatusCode'),
                    ),
                    undefined,
                    [
                      factory.createIdentifier(RouterNames.toolkit),
                      factory.createIdentifier(RouterNames.typedResponse),
                    ],
                  ),
                ),
              ),
              factory.createPropertyAssignment(
                factory.createIdentifier(RouterNames.body),
                factory.createAwaitExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(RouterNames.adapter),
                      factory.createIdentifier('getResponseBody'),
                    ),
                    undefined,
                    [
                      factory.createIdentifier(RouterNames.toolkit),
                      factory.createIdentifier(RouterNames.typedResponse),
                    ],
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
        factory.createIdentifier(RouterNames.adapter),
        factory.createIdentifier('respond'),
      ),
      undefined,
      [factory.createIdentifier(RouterNames.toolkit), factory.createIdentifier(RouterNames.rawResponse)],
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
            factory.createIdentifier(RouterNames.adapter),
            factory.createIdentifier('handleError'),
          ),
          undefined,
          [factory.createIdentifier(RouterNames.toolkit), factory.createIdentifier(RouterNames.error)],
        ),
      ),
    ],
    true,
  )

  const tryCatch = factory.createTryStatement(
    tryBlock,
    factory.createCatchClause(
      factory.createVariableDeclaration(factory.createIdentifier(RouterNames.error), undefined, undefined, undefined),
      catchBlock,
    ),
    undefined,
  )

  return factory.createBlock([expressParams, adapter, api, tryCatch])
}
