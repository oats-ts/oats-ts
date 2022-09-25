import {
  EnhancedOperation,
  hasInput,
  hasRequestBody,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { factory, NodeFlags } from 'typescript'
import { ExpressRoutersGeneratorConfig } from './typings'
import { getParametersStatementAst } from './getParametersStatementAst'
import { getRequestBodyRelatedStatementAsts } from './getRequestBodyRelatedStatementAsts'
import { RouterNames } from '../utils/RouterNames'
import { getAdapterStatement, getCatchBlock, getToolkitStatement } from './common'
import { getCorsParameters } from './cors/getCorsParameters'

export function getHandlerBodyAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
) {
  const { referenceOf, nameOf, document } = context

  const hasInputParams = hasInput(data, context, true)
  const hasPath = data.path.length > 0
  const hasQuery = data.query.length > 0
  const hasHeaders = data.header.length > 0
  const hasCookie = data.cookie.length > 0
  const hasBody = hasRequestBody(data, context)

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
    ...getParametersStatementAst('cookie', data, context),
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
                    ...(hasCookie
                      ? [
                          factory.createShorthandPropertyAssignment(
                            factory.createIdentifier(RouterNames.cookies),
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

  const corsHeaders = config.cors
    ? factory.createAwaitExpression(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(RouterNames.adapter),
            factory.createIdentifier(RouterNames.getCorsHeaders),
          ),
          undefined,
          getCorsParameters(data, context, config),
        ),
      )
    : factory.createIdentifier('undefined')

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
                      factory.createIdentifier(RouterNames.getResponseHeaders),
                    ),
                    undefined,
                    [
                      factory.createIdentifier(RouterNames.toolkit),
                      factory.createIdentifier(RouterNames.typedResponse),
                      referenceOf(data.operation, 'oats/response-headers-serializer') ??
                        factory.createIdentifier('undefined'),
                      corsHeaders,
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
              ...(hasCookie
                ? [
                    factory.createPropertyAssignment(
                      factory.createIdentifier(RouterNames.cookies),
                      factory.createAwaitExpression(
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier(RouterNames.adapter),
                            factory.createIdentifier('getResponseCookies'),
                          ),
                          undefined,
                          [
                            factory.createIdentifier(RouterNames.toolkit),
                            factory.createIdentifier(RouterNames.typedResponse),
                            referenceOf(data.operation, 'oats/set-cookie-serializer') ??
                              factory.createIdentifier('undefined'),
                          ],
                        ),
                      ),
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
  )
  const respondStatement = factory.createExpressionStatement(
    factory.createAwaitExpression(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(RouterNames.adapter),
          factory.createIdentifier(RouterNames.respond),
        ),
        undefined,
        [factory.createIdentifier(RouterNames.toolkit), factory.createIdentifier(RouterNames.rawResponse)],
      ),
    ),
  )

  const tryBlock = factory.createBlock(
    [...parameters, ...body, ...typedRequest, typedResponse, normalizedResponse, respondStatement],
    true,
  )

  const tryCatch = factory.createTryStatement(
    tryBlock,
    factory.createCatchClause(
      factory.createVariableDeclaration(factory.createIdentifier(RouterNames.error), undefined, undefined, undefined),
      getCatchBlock(),
    ),
    undefined,
  )

  return factory.createBlock([getToolkitStatement(), getAdapterStatement(config), api, tryCatch])
}
