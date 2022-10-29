import { OperationObject } from '@oats-ts/openapi-model'
import { OperationsGeneratorConfig } from './typings'
import {
  EnhancedOperation,
  hasRequestBody,
  hasResponseHeaders,
  hasResponses,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import {
  Expression,
  TypeNode,
  ImportDeclaration,
  factory,
  SourceFile,
  Statement,
  TypeReferenceNode,
  ParameterDeclaration,
  SyntaxKind,
  Block,
  NodeFlags,
} from 'typescript'
import { createSourceFile, documentNode, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { GeneratorInit, RuntimeDependency, version } from '@oats-ts/oats-ts'
import { isNil } from 'lodash'
import { OperationNames } from './OperationNames'
import { OpenApiHttpPackage, packages, RuntimePackage } from '@oats-ts/model-common'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'

export class OperationsGenerator extends OperationBasedCodeGenerator<OperationsGeneratorConfig> {
  protected httpPkg!: OpenApiHttpPackage
  protected fetchPkg!: RuntimePackage<any, any>

  public name(): OpenAPIGeneratorTarget {
    return 'oats/operation'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    const validatorDep: OpenAPIGeneratorTarget[] = ['oats/response-body-validator']
    const cookieSerializerDep: OpenAPIGeneratorTarget[] = ['oats/cookie-serializer']
    const cookieDeserializerDep: OpenAPIGeneratorTarget[] = ['oats/set-cookie-deserializer']
    const cookieTypeDep: OpenAPIGeneratorTarget[] = ['oats/cookies-type']
    const config = this.configuration()
    return [
      'oats/type',
      'oats/request-headers-type',
      'oats/query-type',
      'oats/path-type',
      'oats/response-type',
      'oats/request-type',
      'oats/request-headers-serializer',
      'oats/path-serializer',
      'oats/query-serializer',
      'oats/response-headers-deserializer',
      ...(config.sendCookieHeader || config.parseSetCookieHeaders ? cookieTypeDep : []),
      ...(config.sendCookieHeader ? cookieSerializerDep : []),
      ...(config.parseSetCookieHeaders ? cookieDeserializerDep : []),
      ...(config.validate ? validatorDep : []),
    ]
  }

  public initialize(init: GeneratorInit<OpenAPIReadOutput, SourceFile>): void {
    super.initialize(init)
    this.httpPkg = this.getHttpPackage()
    this.fetchPkg = this.getFetchPackage()
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [
      { name: this.httpPkg.name, version },
      /* Adding this as runtime package as otherwise it's undiscoverable */
      { name: this.fetchPkg.name, version },
    ]
  }

  public referenceOf(input: OperationObject): TypeNode | Expression {
    return factory.createIdentifier(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return getModelImports(fromPath, this.name(), [input], this.context)
  }

  protected async generateItem(item: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(item.operation, 'oats/operation')
    return success(createSourceFile(path, this.getImportDeclarations(path, item), [this.getOperationFunctionAst(item)]))
  }

  protected getImportDeclarations(path: string, item: EnhancedOperation): ImportDeclaration[] {
    return [
      getNamedImports(this.httpPkg.name, [this.httpPkg.exports.RawHttpRequest, this.httpPkg.exports.ClientAdapter]),
      ...this.context.dependenciesOf(path, item.operation, 'oats/request-type'),
      ...this.context.dependenciesOf(path, item.operation, 'oats/response-type'),
      ...this.context.dependenciesOf(path, item.operation, 'oats/path-serializer'),
      ...this.context.dependenciesOf(path, item.operation, 'oats/query-serializer'),
      ...this.context.dependenciesOf(path, item.operation, 'oats/request-headers-serializer'),
      ...this.context.dependenciesOf(path, item.operation, 'oats/response-headers-deserializer'),
      ...(this.configuration().validate
        ? this.context.dependenciesOf(path, item.operation, 'oats/response-body-validator')
        : []),
      ...(this.configuration().sendCookieHeader
        ? [...this.context.dependenciesOf(path, item.operation, 'oats/cookie-serializer')]
        : []),
      ...(this.configuration().parseSetCookieHeaders
        ? [...this.context.dependenciesOf(path, item.operation, 'oats/set-cookie-deserializer')]
        : []),
    ]
  }

  protected getOperationFunctionAst(data: EnhancedOperation): Statement {
    const { operation } = data

    const responseType = this.context.referenceOf<TypeReferenceNode>(operation, 'oats/response-type')
    const requestType = this.context.referenceOf<TypeReferenceNode>(operation, 'oats/request-type')
    const params: ParameterDeclaration[] = [
      ...(isNil(requestType)
        ? []
        : [factory.createParameterDeclaration([], [], undefined, OperationNames.request, undefined, requestType)]),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        OperationNames.adapter,
        undefined,
        factory.createTypeReferenceNode(this.httpPkg.exports.ClientAdapter),
      ),
    ]

    const node = factory.createFunctionDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
      undefined,
      this.context.nameOf(operation, 'oats/operation'),
      [],
      params,
      factory.createTypeReferenceNode('Promise', [
        isNil(responseType) ? factory.createTypeReferenceNode('void') : responseType,
      ]),
      this.getOperationBodyAst(data),
    )
    return this.configuration().documentation ? documentNode(node, operation) : node
  }

  protected getOperationBodyAst(data: EnhancedOperation): Block {
    const statements = [
      this.getPathParametersStatement(data),
      this.getQueryParametersStatement(data),
      this.getRequestUrlStatement(data),
      this.getCookiesStatement(data),
      this.getRequestHeadersStatement(data),
      this.getRequestBodyStatement(data),
      this.getRawRequestStatement(data),
      this.getRawResponseStatement(data),
      this.getMimeTypeStatement(data),
      this.getStatusCodeStatement(data),
      this.getResponseHeadersStatement(data),
      this.getResponseCookiesStatement(data),
      this.getResponseBodyStatement(data),
      this.getReturnStatement(data),
    ].filter((statement): statement is Statement => !isNil(statement))

    return factory.createBlock(statements, true)
  }

  protected getReturnStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createReturnStatement(
      factory.createAsExpression(
        factory.createObjectLiteralExpression(
          [
            factory.createShorthandPropertyAssignment(factory.createIdentifier(OperationNames.mimeType), undefined),
            factory.createShorthandPropertyAssignment(factory.createIdentifier(OperationNames.statusCode), undefined),
            ...(hasResponseHeaders(data.operation, this.context)
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
            ...(data.cookie.length > 0 && this.configuration().parseSetCookieHeaders
              ? [
                  factory.createPropertyAssignment(
                    factory.createIdentifier(OperationNames.cookies),
                    factory.createIdentifier(OperationNames.responseCookies),
                  ),
                ]
              : []),
          ],
          true,
        ),
        factory.createTypeReferenceNode(this.context.referenceOf(data.operation, 'oats/response-type'), undefined),
      ),
    )
  }

  protected getResponseBodyStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createVariableStatement(
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
                  this.configuration().validate && hasResponses(data.operation, this.context)
                    ? this.context.referenceOf(data.operation, 'oats/response-body-validator')
                    : factory.createIdentifier('undefined'),
                ],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getResponseCookiesStatement(data: EnhancedOperation): Statement | undefined {
    if (data.cookie.length === 0 || !this.configuration().parseSetCookieHeaders) {
      return undefined
    }
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(OperationNames.responseCookies),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(OperationNames.adapter),
                  factory.createIdentifier(OperationNames.getResponseCookies),
                ),
                undefined,
                [
                  factory.createIdentifier(OperationNames.rawResponse),
                  this.context.referenceOf(data.operation, 'oats/set-cookie-deserializer'),
                ],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getResponseHeadersStatement(data: EnhancedOperation): Statement | undefined {
    if (!hasResponseHeaders(data.operation, this.context)) {
      return undefined
    }
    return factory.createVariableStatement(
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
                  hasResponseHeaders(data.operation, this.context)
                    ? this.context.referenceOf(data.operation, 'oats/response-headers-deserializer')
                    : factory.createIdentifier('undefined'),
                ],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getStatusCodeStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createVariableStatement(
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
  }

  protected getMimeTypeStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createVariableStatement(
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
  }

  protected getRawResponseStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createVariableStatement(
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
  }

  protected getRawRequestStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(OperationNames.rawRequest),
            undefined,
            factory.createTypeReferenceNode(factory.createIdentifier(this.httpPkg.exports.RawHttpRequest), undefined),
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
                ...(hasRequestBody(data, this.context)
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
  }

  protected getRequestBodyStatement(data: EnhancedOperation): Statement | undefined {
    if (!hasRequestBody(data, this.context)) {
      return undefined
    }
    return factory.createVariableStatement(
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
  }

  protected getRequestHeadersStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createVariableStatement(
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
                  hasRequestBody(data, this.context)
                    ? factory.createPropertyAccessExpression(
                        factory.createIdentifier(OperationNames.request),
                        factory.createIdentifier(OperationNames.mimeType),
                      )
                    : factory.createIdentifier('undefined'),
                  data.cookie.length > 0 && this.configuration().sendCookieHeader
                    ? factory.createIdentifier(OperationNames.cookies)
                    : factory.createIdentifier('undefined'),
                  data.header.length > 0
                    ? this.context.referenceOf(data.operation, 'oats/request-headers-serializer')
                    : factory.createIdentifier('undefined'),
                ],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getCookiesStatement(data: EnhancedOperation): Statement | undefined {
    if (data.cookie.length === 0 || !this.configuration().sendCookieHeader) {
      return undefined
    }
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(OperationNames.cookies),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(OperationNames.adapter),
                  factory.createIdentifier(OperationNames.getCookies),
                ),
                undefined,
                [
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(OperationNames.request),
                    factory.createIdentifier(OperationNames.cookies),
                  ),
                  this.context.referenceOf(data.operation, 'oats/cookie-serializer'),
                ],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getRequestUrlStatement(data: EnhancedOperation) {
    return factory.createVariableStatement(
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
                  data.path.length === 0
                    ? factory.createStringLiteral(data.url)
                    : factory.createIdentifier(OperationNames.path),
                  data.query.length === 0
                    ? factory.createIdentifier('undefined')
                    : factory.createIdentifier(OperationNames.query),
                ],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getQueryParametersStatement(data: EnhancedOperation): Statement | undefined {
    if (data.query.length === 0) {
      return undefined
    }

    return factory.createVariableStatement(
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
                  this.context.referenceOf(data.operation, 'oats/query-serializer'),
                ],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getPathParametersStatement(data: EnhancedOperation): Statement | undefined {
    if (data.path.length === 0) {
      return undefined
    }
    return factory.createVariableStatement(
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
                  this.context.referenceOf(data.operation, 'oats/path-serializer'),
                ],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getHttpPackage(): OpenApiHttpPackage {
    return packages.openApiHttp(this.context)
  }

  protected getFetchPackage(): RuntimePackage<any, any> {
    return packages.openApiFetchClientAdapter(this.context)
  }
}
