import {
  OpenAPIGeneratorTarget,
  EnhancedOperation,
  getRequestBodyContent,
  hasRequestBody,
  hasInput,
} from '@oats-ts/openapi-common'
import { ExpressRouterFactoriesGeneratorConfig } from './typings'
import { OperationObject } from '@oats-ts/openapi-model'
import {
  TypeNode,
  Expression,
  factory,
  ImportDeclaration,
  SourceFile,
  Statement,
  SyntaxKind,
  ParameterDeclaration,
  Block,
  NodeFlags,
} from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { GeneratorInit, RuntimeDependency, version } from '@oats-ts/oats-ts'
import { RouterNames } from '../utils/RouterNames'
import { flatMap, isEqual, isNil, keys, uniqWith, values } from 'lodash'
import { getPathTemplate } from '../utils/getPathTemplate'
import { ExpressPackage, OpenApiExpressServerAdapterPackage, OpenApiHttpPackage, packages } from '@oats-ts/model-common'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'

export class ExpressRouterFactoriesGenerator extends OperationBasedCodeGenerator<ExpressRouterFactoriesGeneratorConfig> {
  protected expressPkg!: ExpressPackage
  protected adapterPkg!: OpenApiExpressServerAdapterPackage
  protected httpPkg!: OpenApiHttpPackage

  public name(): OpenAPIGeneratorTarget {
    return 'oats/express-router-factory'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    const cors: OpenAPIGeneratorTarget[] = ['oats/cors-configuration']
    return [
      'oats/type',
      'oats/request-server-type',
      'oats/api-type',
      'oats/path-deserializer',
      'oats/query-deserializer',
      'oats/cookie-deserializer',
      'oats/set-cookie-serializer',
      'oats/request-headers-deserializer',
      'oats/response-headers-serializer',
      'oats/request-body-validator',
      ...(this.configuration().cors ? cors : []),
    ]
  }

  public initialize(init: GeneratorInit<OpenAPIReadOutput, SourceFile>): void {
    super.initialize(init)
    this.expressPkg = this.getExpressPackage()
    this.adapterPkg = this.getAdapterPackage()
    this.httpPkg = this.getHttpPackage()
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [
      { name: this.httpPkg.name, version: version },
      { name: this.adapterPkg.name, version: version },
      { name: this.expressPkg.name, version: '^4.18.1' },
    ]
  }

  public referenceOf(input: OperationObject): TypeNode | Expression {
    return factory.createIdentifier(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return getModelImports(fromPath, this.id, [input], this.context)
  }

  protected async generateItem(item: EnhancedOperation): Promise<Try<SourceFile>> {
    return success(
      createSourceFile(this.context.pathOf(item.operation, this.name()), this.getImportDeclarations(item), [
        this.getExpressRouterFactoryStatement(item),
      ]),
    )
  }

  protected getImportDeclarations(operation: EnhancedOperation): ImportDeclaration[] {
    const path = this.context.pathOf(operation.operation, this.name())
    const bodyTypesImports = flatMap(
      values(getRequestBodyContent(operation, this.context)).filter((mediaType) => !isNil(mediaType?.schema)),
      (mediaType): ImportDeclaration[] => this.context.dependenciesOf(path, mediaType.schema, 'oats/type'),
    )
    return [
      getNamedImports(this.httpPkg.name, [this.httpPkg.imports.RawHttpResponse, this.httpPkg.imports.ServerAdapter]),
      getNamedImports(this.adapterPkg.name, [this.adapterPkg.imports.ExpressToolkit]),
      getNamedImports(this.expressPkg.name, [
        this.expressPkg.imports.IRouter,
        this.expressPkg.imports.Router,
        this.expressPkg.imports.Request,
        this.expressPkg.imports.Response,
        this.expressPkg.imports.NextFunction,
      ]),
      ...this.context.dependenciesOf(path, this.context.document, 'oats/api-type'),
      ...this.context.dependenciesOf(path, operation.operation, 'oats/path-deserializer'),
      ...this.context.dependenciesOf(path, operation.operation, 'oats/query-deserializer'),
      ...this.context.dependenciesOf(path, operation.operation, 'oats/request-headers-deserializer'),
      ...this.context.dependenciesOf(path, operation.operation, 'oats/request-body-validator'),
      ...this.context.dependenciesOf(path, operation.operation, 'oats/request-server-type'),
      ...this.context.dependenciesOf(path, operation.operation, 'oats/response-headers-serializer'),
      ...this.context.dependenciesOf(path, operation.operation, 'oats/cookie-deserializer'),
      ...this.context.dependenciesOf(path, operation.operation, 'oats/set-cookie-serializer'),
      ...(this.configuration().cors
        ? this.context.dependenciesOf(path, this.context.document, 'oats/cors-configuration')
        : []),
      ...bodyTypesImports,
    ]
  }

  protected getExpressRouterFactoryStatement(data: EnhancedOperation): Statement {
    return factory.createFunctionDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      undefined,
      this.context.nameOf(data.operation, this.name()),
      [],
      [
        factory.createParameterDeclaration(
          [],
          [],
          undefined,
          RouterNames.router,
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createUnionTypeNode([
            factory.createTypeReferenceNode(this.expressPkg.exports.IRouter, undefined),
            factory.createTypeReferenceNode('undefined', undefined),
          ]),
        ),
      ],
      factory.createTypeReferenceNode(this.expressPkg.exports.IRouter),
      factory.createBlock([factory.createReturnStatement(this.getExpressRouterExpressionAst(data))]),
    )
  }

  protected getExpressRouterExpressionAst(data: EnhancedOperation): Expression {
    const routerAst = factory.createBinaryExpression(
      factory.createIdentifier(RouterNames.router),
      SyntaxKind.QuestionQuestionToken,
      factory.createCallExpression(factory.createIdentifier(this.expressPkg.exports.Router), [], []),
    )
    const url = getPathTemplate(data.url)
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(routerAst, data.method.toLowerCase()),
      [],
      [factory.createStringLiteral(url), this.getExpressRouterHandlerAst(data)],
    )
  }

  protected getExpressRouterHandlerAst(data: EnhancedOperation): Expression {
    return factory.createArrowFunction(
      [factory.createModifier(SyntaxKind.AsyncKeyword)],
      [],
      this.getExpressRouterHandlerParameters(),
      factory.createTypeReferenceNode('Promise', [factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)]),
      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
      this.getHandlerBodyAst(data),
    )
  }

  protected getExpressRouterHandlerParameters(): ParameterDeclaration[] {
    return [
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        RouterNames.request,
        undefined,
        factory.createTypeReferenceNode(this.expressPkg.exports.Request),
      ),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        RouterNames.response,
        undefined,
        factory.createTypeReferenceNode(this.expressPkg.exports.Response),
      ),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        RouterNames.next,
        undefined,
        factory.createTypeReferenceNode(this.expressPkg.exports.NextFunction),
      ),
    ]
  }

  protected getHandlerBodyAst(data: EnhancedOperation): Block {
    return factory.createBlock([
      this.getToolkitStatement(data),
      this.getAdapterStatement(data),
      this.getApiStatement(data),
      this.getTryCatchBlock(data),
    ])
  }

  protected getToolkitStatement(data: EnhancedOperation): Statement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(RouterNames.toolkit),
            undefined,
            factory.createTypeReferenceNode(
              factory.createIdentifier(this.adapterPkg.exports.ExpressToolkit),
              undefined,
            ),
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
  }

  protected getApiStatement(data: EnhancedOperation): Statement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(RouterNames.api),
            undefined,
            factory.createTypeReferenceNode(this.context.referenceOf(this.context.document, 'oats/api-type')),
            factory.createElementAccessExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(RouterNames.response),
                factory.createIdentifier(RouterNames.locals),
              ),
              factory.createStringLiteral(RouterNames.apiKey(this.context.hashOf(this.context.document))),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getAdapterStatement(data: EnhancedOperation): Statement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(RouterNames.adapter),
            undefined,
            factory.createTypeReferenceNode(factory.createIdentifier(this.httpPkg.exports.ServerAdapter), [
              factory.createTypeReferenceNode(
                factory.createIdentifier(this.adapterPkg.exports.ExpressToolkit),
                undefined,
              ),
            ]),
            factory.createElementAccessExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(RouterNames.response),
                factory.createIdentifier(RouterNames.locals),
              ),
              factory.createStringLiteral(RouterNames.adapterKey(this.context.hashOf(this.context.document))),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  private getTryCatchBlock(data: EnhancedOperation) {
    const statements = [
      this.getQueryParametersStatement(data),
      this.getParametersParametersStatement(data),
      this.getRequestHeadersParamtersStatement(data),
      this.getCookieParametersStatement(data),
      this.getMimeTypeStatement(data),
      this.getRequestBodyStatement(data),
      this.getTypeRequestStatement(data),
      this.getCorsConfigurationStatement(data),
      this.getCorsHeadersStatement(data),
      this.getTypedResponseStatement(data),
      this.getNormalizedResponseStatement(data),
      this.getRespondStatement(data),
    ].filter((statement): statement is Statement => !isNil(statement))

    return factory.createTryStatement(
      factory.createBlock(statements, true),
      factory.createCatchClause(
        factory.createVariableDeclaration(factory.createIdentifier(RouterNames.error), undefined, undefined, undefined),
        factory.createBlock(
          [
            factory.createExpressionStatement(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(RouterNames.adapter),
                  factory.createIdentifier(RouterNames.handleError),
                ),
                undefined,
                [factory.createIdentifier(RouterNames.toolkit), factory.createIdentifier(RouterNames.error)],
              ),
            ),
          ],
          true,
        ),
      ),
      undefined,
    )
  }

  protected getParametersStatementAst(
    data: EnhancedOperation,
    name: string,
    getterName: string,
    deserializer: OpenAPIGeneratorTarget,
  ): Statement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(name),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(RouterNames.adapter),
                  factory.createIdentifier(getterName),
                ),
                undefined,
                [factory.createIdentifier(RouterNames.toolkit), this.context.referenceOf(data.operation, deserializer)],
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
    return this.getParametersStatementAst(data, RouterNames.query, 'getQueryParameters', 'oats/query-deserializer')
  }

  protected getParametersParametersStatement(data: EnhancedOperation): Statement | undefined {
    if (data.path.length === 0) {
      return undefined
    }
    return this.getParametersStatementAst(data, RouterNames.path, 'getPathParameters', 'oats/path-deserializer')
  }

  protected getRequestHeadersParamtersStatement(data: EnhancedOperation): Statement | undefined {
    if (data.header.length === 0) {
      return undefined
    }
    return this.getParametersStatementAst(
      data,
      RouterNames.headers,
      'getRequestHeaders',
      'oats/request-headers-deserializer',
    )
  }

  protected getCookieParametersStatement(data: EnhancedOperation): Statement | undefined {
    if (data.cookie.length === 0) {
      return undefined
    }
    return this.getParametersStatementAst(data, RouterNames.cookies, 'getCookieParameters', 'oats/cookie-deserializer')
  }

  protected getBodyType(data: EnhancedOperation): TypeNode {
    const bodyTypes = uniqWith(
      values(getRequestBodyContent(data, this.context))
        .map((mediaType) => mediaType.schema)
        .filter((schema) => !isNil(schema))
        .map((schema) => this.context.referenceOf<TypeNode>(schema, 'oats/type')),
      isEqual,
    )
    switch (bodyTypes.length) {
      case 0:
        return factory.createTypeReferenceNode('any')
      case 1:
        return bodyTypes[0]
      default:
        return factory.createUnionTypeNode(bodyTypes)
    }
  }

  protected getMimeTypeType(data: EnhancedOperation): TypeNode {
    const mediaTypes = Array.from(new Set(keys(getRequestBodyContent(data, this.context)))).map(
      (mediaType): TypeNode => factory.createLiteralTypeNode(factory.createStringLiteral(mediaType)),
    )
    switch (mediaTypes.length) {
      case 0:
        return factory.createTypeReferenceNode('any')
      case 1:
        return mediaTypes[0]
      default:
        return factory.createUnionTypeNode(mediaTypes)
    }
  }

  protected getRequestBodyStatement(data: EnhancedOperation): Statement | undefined {
    if (!hasRequestBody(data, this.context)) {
      return undefined
    }
    const mimeType = this.getMimeTypeType(data)
    const bodyType = this.getBodyType(data)
    const reqBody = this.context.dereference(data.operation.requestBody, true)

    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(RouterNames.body),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(RouterNames.adapter),
                  factory.createIdentifier('getRequestBody'),
                ),
                [mimeType, bodyType],
                [
                  factory.createIdentifier(RouterNames.toolkit),
                  reqBody?.required ? factory.createTrue() : factory.createFalse(),
                  factory.createIdentifier(RouterNames.mimeType),
                  this.context.referenceOf(data.operation, 'oats/request-body-validator'),
                ],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getMimeTypeStatement(data: EnhancedOperation): Statement | undefined {
    if (!hasRequestBody(data, this.context)) {
      return undefined
    }
    const mimeType = this.getMimeTypeType(data)

    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(RouterNames.mimeType),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(RouterNames.adapter),
                  factory.createIdentifier('getMimeType'),
                ),
                [mimeType],
                [factory.createIdentifier(RouterNames.toolkit)],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getTypeRequestStatement(data: EnhancedOperation): Statement | undefined {
    const hasPath = data.path.length > 0
    const hasQuery = data.query.length > 0
    const hasHeaders = data.header.length > 0
    const hasCookie = data.cookie.length > 0
    const hasBody = hasRequestBody(data, this.context)

    if (!hasInput(data, this.context, true)) {
      return undefined
    }

    const properties = [
      ...(hasPath
        ? [factory.createShorthandPropertyAssignment(factory.createIdentifier(RouterNames.path), undefined)]
        : []),
      ...(hasQuery
        ? [factory.createShorthandPropertyAssignment(factory.createIdentifier(RouterNames.query), undefined)]
        : []),
      ...(hasHeaders
        ? [factory.createShorthandPropertyAssignment(factory.createIdentifier(RouterNames.headers), undefined)]
        : []),
      ...(hasCookie
        ? [factory.createShorthandPropertyAssignment(factory.createIdentifier(RouterNames.cookies), undefined)]
        : []),
      ...(hasBody
        ? [
            factory.createShorthandPropertyAssignment(factory.createIdentifier(RouterNames.mimeType), undefined),
            factory.createShorthandPropertyAssignment(factory.createIdentifier(RouterNames.body), undefined),
          ]
        : []),
    ]
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(RouterNames.typedRequest),
            undefined,
            factory.createTypeReferenceNode(
              this.context.referenceOf(data.operation, 'oats/request-server-type'),
              undefined,
            ),
            factory.createObjectLiteralExpression(properties, true),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getTypedResponseStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createVariableStatement(
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
                  this.context.nameOf(data.operation, 'oats/operation'),
                ),
                undefined,
                hasInput(data, this.context, true) ? [factory.createIdentifier(RouterNames.typedRequest)] : [],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getCorsConfigurationStatement(data: EnhancedOperation): Statement | undefined {
    if (!this.configuration().cors) {
      return undefined
    }
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(RouterNames.corsConfig),
            undefined,
            undefined,
            data.method === 'delete'
              ? factory.createElementAccessChain(
                  factory.createElementAccessChain(
                    this.context.referenceOf(this.context.document, 'oats/cors-configuration'),
                    factory.createToken(SyntaxKind.QuestionDotToken),
                    factory.createStringLiteral(data.url),
                  ),
                  factory.createToken(SyntaxKind.QuestionDotToken),
                  factory.createStringLiteral(data.method),
                )
              : factory.createPropertyAccessChain(
                  factory.createElementAccessChain(
                    this.context.referenceOf(this.context.document, 'oats/cors-configuration'),
                    factory.createToken(SyntaxKind.QuestionDotToken),
                    factory.createStringLiteral(data.url),
                  ),
                  factory.createToken(SyntaxKind.QuestionDotToken),
                  factory.createIdentifier(data.method),
                ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getCorsHeadersStatement(data: EnhancedOperation): Statement | undefined {
    if (!this.configuration().cors) {
      return undefined
    }
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(RouterNames.corsHeaders),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(RouterNames.adapter),
                  factory.createIdentifier(RouterNames.getCorsHeaders),
                ),
                undefined,
                [factory.createIdentifier(RouterNames.toolkit), factory.createIdentifier(RouterNames.corsConfig)],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getNormalizedResponseStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(RouterNames.rawResponse),
            undefined,
            factory.createTypeReferenceNode(factory.createIdentifier(this.httpPkg.exports.RawHttpResponse), undefined),
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
                        this.context.referenceOf(data.operation, 'oats/response-headers-serializer') ??
                          factory.createIdentifier('undefined'),
                        this.configuration().cors
                          ? factory.createIdentifier(RouterNames.corsHeaders)
                          : factory.createIdentifier('undefined'),
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
                ...(data.cookie.length > 0
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
                              this.context.referenceOf(data.operation, 'oats/set-cookie-serializer') ??
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
  }

  protected getRespondStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createExpressionStatement(
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
  }

  protected getExpressPackage(): ExpressPackage {
    return packages.express(this.context)
  }

  protected getHttpPackage(): OpenApiHttpPackage {
    return packages.openApiHttp(this.context)
  }

  protected getAdapterPackage(): OpenApiExpressServerAdapterPackage {
    return packages.openApiExpressServerAdapter(this.context)
  }
}
