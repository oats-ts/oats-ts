import {
  EnhancedOperation,
  hasRequestBody,
  hasResponseHeaders,
  hasResponses,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { isNil } from 'lodash'
import { factory, NodeFlags } from 'typescript'
import { OperationsGeneratorConfig } from '.'
import { OperationNames } from './OperationNames'

export function getOperationBodyAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
) {
  const { referenceOf } = context
  const path =
    data.path.length > 0
      ? factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier(OperationNames.path),
                undefined,
                undefined,
                factory.createAwaitExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(OperationNames.adapter),
                      factory.createIdentifier(OperationNames.getPath),
                    ),
                    undefined,
                    [
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(OperationNames.request),
                        factory.createIdentifier(OperationNames.path),
                      ),
                      referenceOf(data.operation, 'oats/path-serializer'),
                    ],
                  ),
                ),
              ),
            ],
            NodeFlags.Const,
          ),
        )
      : undefined
  const query =
    data.query.length > 0
      ? factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier(OperationNames.query),
                undefined,
                undefined,
                factory.createAwaitExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(OperationNames.adapter),
                      factory.createIdentifier(OperationNames.getQuery),
                    ),
                    undefined,
                    [
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(OperationNames.request),
                        factory.createIdentifier(OperationNames.query),
                      ),
                      referenceOf(data.operation, 'oats/query-serializer'),
                    ],
                  ),
                ),
              ),
            ],
            NodeFlags.Const,
          ),
        )
      : undefined
  const requestUrl = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(OperationNames.requestUrl),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(OperationNames.adapter),
                factory.createIdentifier(OperationNames.getUrl),
              ),
              undefined,
              [
                isNil(path) ? factory.createStringLiteral(data.url) : factory.createIdentifier(OperationNames.path),
                isNil(query) ? factory.createIdentifier('undefined') : factory.createIdentifier(OperationNames.query),
              ],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
  const requestHeaders = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(OperationNames.requestHeaders),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(OperationNames.adapter),
                factory.createIdentifier(OperationNames.getRequestHeaders),
              ),
              undefined,
              [
                data.header.length > 0
                  ? factory.createPropertyAccessExpression(
                      factory.createIdentifier(OperationNames.request),
                      factory.createIdentifier(OperationNames.headers),
                    )
                  : factory.createIdentifier('undefined'),
                hasRequestBody(data, context)
                  ? factory.createPropertyAccessExpression(
                      factory.createIdentifier(OperationNames.request),
                      factory.createIdentifier(OperationNames.mimeType),
                    )
                  : factory.createIdentifier('undefined'),
                data.header.length > 0
                  ? referenceOf(data.operation, 'oats/request-headers-serializer')
                  : factory.createIdentifier('undefined'),
              ],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
  const requestBody = hasRequestBody(data, context)
    ? factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(OperationNames.requestBody),
              undefined,
              undefined,
              factory.createAwaitExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(OperationNames.adapter),
                    factory.createIdentifier(OperationNames.getRequestBody),
                  ),
                  undefined,
                  [
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(OperationNames.request),
                      factory.createIdentifier(OperationNames.mimeType),
                    ),
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(OperationNames.request),
                      factory.createIdentifier(OperationNames.body),
                    ),
                  ],
                ),
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      )
    : undefined
  const rawRequest = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(OperationNames.rawRequest),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Http.RawHttpRequest), undefined),
          factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(
                factory.createIdentifier(OperationNames.url),
                factory.createIdentifier(OperationNames.requestUrl),
              ),
              factory.createPropertyAssignment(
                factory.createIdentifier(OperationNames.method),
                factory.createStringLiteral(data.method),
              ),
              ...(hasRequestBody(data, context)
                ? [
                    factory.createPropertyAssignment(
                      factory.createIdentifier(OperationNames.body),
                      factory.createIdentifier(OperationNames.requestBody),
                    ),
                  ]
                : []),
              factory.createPropertyAssignment(
                factory.createIdentifier(OperationNames.headers),
                factory.createIdentifier(OperationNames.requestHeaders),
              ),
            ],
            true,
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
  const rawResponse = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(OperationNames.rawResponse),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(OperationNames.adapter),
                factory.createIdentifier(OperationNames.request),
              ),
              undefined,
              [factory.createIdentifier(OperationNames.rawRequest)],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
  const mimeType = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(OperationNames.mimeType),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(OperationNames.adapter),
                factory.createIdentifier(OperationNames.getMimeType),
              ),
              undefined,
              [factory.createIdentifier(OperationNames.rawResponse)],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
  const statusCode = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(OperationNames.statusCode),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(OperationNames.adapter),
                factory.createIdentifier(OperationNames.getStatusCode),
              ),
              undefined,
              [factory.createIdentifier(OperationNames.rawResponse)],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )
  const responseHeaders = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(OperationNames.responseHeaders),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(OperationNames.adapter),
                factory.createIdentifier(OperationNames.getResponseHeaders),
              ),
              undefined,
              [
                factory.createIdentifier(OperationNames.rawResponse),
                factory.createIdentifier(OperationNames.statusCode),
                hasResponseHeaders(data.operation, context)
                  ? referenceOf(data.operation, 'oats/response-headers-deserializer')
                  : factory.createIdentifier('undefined'),
              ],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )

  const responseBody = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(OperationNames.responseBody),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(OperationNames.adapter),
                factory.createIdentifier(OperationNames.getResponseBody),
              ),
              undefined,
              [
                factory.createIdentifier(OperationNames.rawResponse),
                factory.createIdentifier(OperationNames.statusCode),
                factory.createIdentifier(OperationNames.mimeType),
                config.validate && hasResponses(data.operation, context)
                  ? referenceOf(data.operation, 'oats/response-body-validator')
                  : factory.createIdentifier('undefined'),
              ],
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  )

  const returnStatement = factory.createReturnStatement(
    factory.createAsExpression(
      factory.createObjectLiteralExpression(
        [
          factory.createShorthandPropertyAssignment(factory.createIdentifier(OperationNames.mimeType), undefined),
          factory.createShorthandPropertyAssignment(factory.createIdentifier(OperationNames.statusCode), undefined),
          ...(hasResponseHeaders(data.operation, context)
            ? [
                factory.createPropertyAssignment(
                  factory.createIdentifier(OperationNames.headers),
                  factory.createIdentifier(OperationNames.responseHeaders),
                ),
              ]
            : []),
          factory.createPropertyAssignment(
            factory.createIdentifier(OperationNames.body),
            factory.createIdentifier(OperationNames.responseBody),
          ),
        ],
        true,
      ),
      factory.createTypeReferenceNode(referenceOf(data.operation, 'oats/response-type'), undefined),
    ),
  )

  return factory.createBlock(
    [
      ...(isNil(path) ? [] : [path]),
      ...(isNil(query) ? [] : [query]),
      requestUrl,
      requestHeaders,
      ...(isNil(requestBody) ? [] : [requestBody]),
      rawRequest,
      rawResponse,
      mimeType,
      statusCode,
      ...(hasResponseHeaders(data.operation, context) ? [responseHeaders] : []),
      responseBody,
      returnStatement,
    ],
    true,
  )
}
