import { EnhancedOperation, hasRequestBody, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { isNil } from 'lodash'
import { factory, NodeFlags } from 'typescript'
import { Names } from './Names'

export function getOperationBodyAst(data: EnhancedOperation, context: OpenAPIGeneratorContext) {
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
                      factory.createIdentifier(Names.configuration),
                      factory.createIdentifier(Names.getPath),
                    ),
                    undefined,
                    [factory.createIdentifier(Names.input), referenceOf(data.operation, 'openapi/path-serializer')],
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
                      factory.createIdentifier(Names.configuration),
                      factory.createIdentifier(Names.getQuery),
                    ),
                    undefined,
                    [factory.createIdentifier(Names.input), referenceOf(data.operation, 'openapi/query-serializer')],
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
                factory.createIdentifier(Names.configuration),
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
                factory.createIdentifier(Names.configuration),
                factory.createIdentifier(Names.getRequestHeaders),
              ),
              undefined,
              [
                factory.createIdentifier(Names.input),
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
                    factory.createIdentifier(Names.configuration),
                    factory.createIdentifier(Names.getRequestBody),
                  ),
                  undefined,
                  [factory.createIdentifier(Names.input)],
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
  return factory.createBlock(
    [
      ...(isNil(path) ? [] : [path]),
      ...(isNil(query) ? [] : [query]),
      requestUrl,
      requestHeaders,
      ...(isNil(requestBody) ? [] : [requestBody]),
      rawRequest,
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('rawResponse'),
              undefined,
              undefined,
              factory.createAwaitExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('configuration'),
                    factory.createIdentifier('request'),
                  ),
                  undefined,
                  [factory.createIdentifier('rawRequest')],
                ),
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('mimeType'),
              undefined,
              undefined,
              factory.createAwaitExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('configuration'),
                    factory.createIdentifier('getMimeType'),
                  ),
                  undefined,
                  [factory.createIdentifier('rawResponse')],
                ),
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('statusCode'),
              undefined,
              undefined,
              factory.createAwaitExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('configuration'),
                    factory.createIdentifier('getStatusCode'),
                  ),
                  undefined,
                  [factory.createIdentifier('rawResponse')],
                ),
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('responseHeaders'),
              undefined,
              undefined,
              factory.createAwaitExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('configuration'),
                    factory.createIdentifier('getResponseHeaders'),
                  ),
                  undefined,
                  [factory.createIdentifier('rawResponse'), factory.createIdentifier('deserializer')],
                ),
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('responseBody'),
              undefined,
              undefined,
              factory.createAwaitExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('configuration'),
                    factory.createIdentifier('getResponseBody'),
                  ),
                  undefined,
                  [factory.createIdentifier('rawResponse'), factory.createIdentifier('validator')],
                ),
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
      factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('response'),
              undefined,
              undefined,
              factory.createAsExpression(
                factory.createObjectLiteralExpression(
                  [
                    factory.createShorthandPropertyAssignment(factory.createIdentifier('mimeType'), undefined),
                    factory.createShorthandPropertyAssignment(factory.createIdentifier('statusCode'), undefined),
                    factory.createPropertyAssignment(
                      factory.createIdentifier('headers'),
                      factory.createIdentifier('responseHeaders'),
                    ),
                    factory.createPropertyAssignment(
                      factory.createIdentifier('body'),
                      factory.createIdentifier('responseBody'),
                    ),
                  ],
                  true,
                ),
                factory.createTypeReferenceNode(factory.createIdentifier('ResponsType'), undefined),
              ),
            ),
          ],
          NodeFlags.Const,
        ),
      ),
      factory.createReturnStatement(factory.createIdentifier('response')),
    ],
    true,
  )
}
