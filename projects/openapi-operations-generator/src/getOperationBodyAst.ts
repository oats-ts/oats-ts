import {
  EnhancedOperation,
  hasInput,
  hasRequestBody,
  hasResponseHeaders,
  hasResponses,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { isNil } from 'lodash'
import { factory, NodeFlags } from 'typescript'
import { OperationsGeneratorConfig } from '.'
import { Names } from './Names'

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
                factory.createIdentifier(Names.path),
                undefined,
                undefined,
                factory.createAwaitExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(Names.adapter),
                      factory.createIdentifier(Names.getPath),
                    ),
                    undefined,
                    [
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(Names.request),
                        factory.createIdentifier(Names.path),
                      ),
                      referenceOf(data.operation, 'openapi/path-serializer'),
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
                factory.createIdentifier(Names.query),
                undefined,
                undefined,
                factory.createAwaitExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(Names.adapter),
                      factory.createIdentifier(Names.getQuery),
                    ),
                    undefined,
                    [
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(Names.request),
                        factory.createIdentifier(Names.query),
                      ),
                      referenceOf(data.operation, 'openapi/query-serializer'),
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
          factory.createIdentifier(Names.requestUrl),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.adapter),
                factory.createIdentifier(Names.getUrl),
              ),
              undefined,
              [
                isNil(path) ? factory.createStringLiteral(data.url) : factory.createIdentifier(Names.path),
                isNil(query) ? factory.createIdentifier('undefined') : factory.createIdentifier(Names.query),
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
          factory.createIdentifier(Names.requestHeaders),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.adapter),
                factory.createIdentifier(Names.getRequestHeaders),
              ),
              undefined,
              [
                data.header.length > 0
                  ? factory.createPropertyAccessExpression(
                      factory.createIdentifier(Names.request),
                      factory.createIdentifier(Names.headers),
                    )
                  : factory.createIdentifier('undefined'),
                hasRequestBody(data, context)
                  ? factory.createPropertyAccessExpression(
                      factory.createIdentifier(Names.request),
                      factory.createIdentifier(Names.mimeType),
                    )
                  : factory.createIdentifier('undefined'),
                data.header.length > 0
                  ? referenceOf(data.operation, 'openapi/request-headers-serializer')
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
              factory.createIdentifier(Names.requestBody),
              undefined,
              undefined,
              factory.createAwaitExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(Names.adapter),
                    factory.createIdentifier(Names.getRequestBody),
                  ),
                  undefined,
                  [
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(Names.request),
                      factory.createIdentifier(Names.mimeType),
                    ),
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(Names.request),
                      factory.createIdentifier(Names.body),
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
          factory.createIdentifier(Names.rawRequest),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Http.RawHttpRequest), undefined),
          factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(
                factory.createIdentifier(Names.url),
                factory.createIdentifier(Names.requestUrl),
              ),
              factory.createPropertyAssignment(
                factory.createIdentifier(Names.method),
                factory.createStringLiteral(data.method),
              ),
              ...(hasRequestBody(data, context)
                ? [
                    factory.createPropertyAssignment(
                      factory.createIdentifier(Names.body),
                      factory.createIdentifier(Names.requestBody),
                    ),
                  ]
                : []),
              factory.createPropertyAssignment(
                factory.createIdentifier(Names.headers),
                factory.createIdentifier(Names.requestHeaders),
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
          factory.createIdentifier(Names.rawResponse),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.adapter),
                factory.createIdentifier(Names.request),
              ),
              undefined,
              [factory.createIdentifier(Names.rawRequest)],
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
          factory.createIdentifier(Names.mimeType),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.adapter),
                factory.createIdentifier(Names.getMimeType),
              ),
              undefined,
              [factory.createIdentifier(Names.rawResponse)],
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
          factory.createIdentifier(Names.statusCode),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.adapter),
                factory.createIdentifier(Names.getStatusCode),
              ),
              undefined,
              [factory.createIdentifier(Names.rawResponse)],
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
          factory.createIdentifier(Names.responseHeaders),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.adapter),
                factory.createIdentifier(Names.getResponseHeaders),
              ),
              undefined,
              [
                factory.createIdentifier(Names.rawResponse),
                factory.createIdentifier(Names.statusCode),
                hasResponseHeaders(data.operation, context)
                  ? referenceOf(data.operation, 'openapi/response-headers-deserializer')
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
          factory.createIdentifier(Names.responseBody),
          undefined,
          undefined,
          factory.createAwaitExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Names.adapter),
                factory.createIdentifier(Names.getResponseBody),
              ),
              undefined,
              [
                factory.createIdentifier(Names.rawResponse),
                factory.createIdentifier(Names.statusCode),
                factory.createIdentifier(Names.mimeType),
                config.validate && hasResponses(data.operation, context)
                  ? referenceOf(data.operation, 'openapi/response-body-validator')
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
          factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.mimeType), undefined),
          factory.createShorthandPropertyAssignment(factory.createIdentifier(Names.statusCode), undefined),
          ...(hasResponseHeaders(data.operation, context)
            ? [
                factory.createPropertyAssignment(
                  factory.createIdentifier(Names.headers),
                  factory.createIdentifier(Names.responseHeaders),
                ),
              ]
            : []),
          factory.createPropertyAssignment(
            factory.createIdentifier(Names.body),
            factory.createIdentifier(Names.responseBody),
          ),
        ],
        true,
      ),
      factory.createTypeReferenceNode(referenceOf(data.operation, 'openapi/response-type'), undefined),
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
