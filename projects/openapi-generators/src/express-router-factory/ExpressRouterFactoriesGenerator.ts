import {
  OpenAPIGeneratorTarget,
  EnhancedOperation,
  getRequestBodyContent,
  hasRequestBody,
  hasInput,
} from '@oats-ts/openapi-common'
import { ExpressRouterFactoriesGeneratorConfig, ExpressRouterFactoriesLocals } from './typings'
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
  TypeReferenceNode,
} from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { ExpressRouterFactoriesDefaultLocals } from './ExpressRouterFactoriesDefaultLocals'
import { flatMap, isEqual, isNil, keys, uniqWith, values } from 'lodash'
import { getPathTemplate } from '../utils/getPathTemplate'
import { LocalNameDefaults } from '@oats-ts/model-common'
import {
  ExpressFields,
  ExpressToolkitFields,
  RawHttpResponseFields,
  ServerAdapterMethods,
  TypedRequestFields,
} from '../utils/OatsApiNames'
import { ApiTypeLocals } from '../api-type/typings'

export class ExpressRouterFactoriesGenerator extends OperationBasedCodeGenerator<ExpressRouterFactoriesGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/express-router-factory'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    const cors: OpenAPIGeneratorTarget[] = ['oats/cors-configuration']
    return [
      'oats/type',
      'oats/request-server-type',
      'oats/api-type',
      'oats/request-body-validator',
      'oats/path-parameters',
      'oats/query-parameters',
      'oats/cookie-parameters',
      'oats/request-header-parameters',
      'oats/response-header-parameters',
      'oats/path-type',
      'oats/query-type',
      'oats/cookies-type',
      'oats/request-headers-type',
      'oats/response-headers-type',
      ...(this.configuration().cors ? cors : []),
    ]
  }

  protected getDefaultLocals(): LocalNameDefaults {
    return ExpressRouterFactoriesDefaultLocals
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [
      { name: this.httpPkg.name, version: version },
      { name: this.adapterPkg.name, version: version },
      { name: this.expressPkg.name, version: '^4.18.1' },
    ]
  }

  public referenceOf(input: OperationObject): TypeNode | Expression {
    return factory.createIdentifier(this.context().nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return getModelImports(fromPath, this.id, [input], this.context())
  }

  protected async generateItem(item: EnhancedOperation): Promise<Try<SourceFile>> {
    return success(
      createSourceFile(this.context().pathOf(item.operation, this.name()), this.getImportDeclarations(item), [
        this.getExpressRouterFactoryStatement(item),
      ]),
    )
  }

  protected getImportDeclarations(operation: EnhancedOperation): ImportDeclaration[] {
    const path = this.context().pathOf(operation.operation, this.name())
    const bodyTypesImports = flatMap(
      values(getRequestBodyContent(operation, this.context())).filter((mediaType) => !isNil(mediaType?.schema)),
      (mediaType): ImportDeclaration[] => this.context().dependenciesOf(path, mediaType.schema, 'oats/type'),
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
      ...this.context().dependenciesOf<ImportDeclaration>(path, this.context().document(), 'oats/api-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, operation.operation, 'oats/path-parameters'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, operation.operation, 'oats/query-parameters'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, operation.operation, 'oats/cookie-parameters'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, operation.operation, 'oats/request-header-parameters'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, operation.operation, 'oats/response-header-parameters'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, operation.operation, 'oats/path-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, operation.operation, 'oats/query-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, operation.operation, 'oats/cookies-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, operation.operation, 'oats/request-headers-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, operation.operation, 'oats/response-headers-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, operation.operation, 'oats/request-body-validator'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, operation.operation, 'oats/request-server-type'),
      ...(this.configuration().cors
        ? this.context().dependenciesOf<ImportDeclaration>(path, this.context().document(), 'oats/cors-configuration')
        : []),
      ...bodyTypesImports,
    ]
  }

  protected needsResponseCookies(data: EnhancedOperation): boolean {
    return this.getItems().some((operation) => operation.cookie.length > 0)
  }

  protected getExpressRouterFactoryStatement(data: EnhancedOperation): Statement {
    return factory.createFunctionDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      undefined,
      this.context().nameOf(data.operation, this.name()),
      [],
      [
        factory.createParameterDeclaration(
          [],
          [],
          undefined,
          this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'router'),
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
      factory.createIdentifier(
        this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'router'),
      ),
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
        this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'request'),
        undefined,
        factory.createTypeReferenceNode(this.expressPkg.exports.Request),
      ),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'response'),
        undefined,
        factory.createTypeReferenceNode(this.expressPkg.exports.Response),
      ),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'next'),
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
    const fields: [string, string][] = [
      [
        ExpressToolkitFields.request,
        this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'request'),
      ],
      [
        ExpressToolkitFields.response,
        this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'response'),
      ],
      [
        ExpressToolkitFields.next,
        this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'next'),
      ],
    ]

    const properties = fields.map(([key, value]) => {
      return key === value
        ? factory.createShorthandPropertyAssignment(key, undefined)
        : factory.createPropertyAssignment(key, factory.createIdentifier(value))
    })

    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'toolkit'),
            ),
            undefined,
            factory.createTypeReferenceNode(
              factory.createIdentifier(this.adapterPkg.exports.ExpressToolkit),
              undefined,
            ),
            factory.createObjectLiteralExpression(properties, false),
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
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'api'),
            ),
            undefined,
            factory.createTypeReferenceNode(this.context().referenceOf(this.context().document(), 'oats/api-type')),
            factory.createElementAccessExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(
                  this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'response'),
                ),
                factory.createIdentifier(ExpressFields.locals),
              ),
              factory.createStringLiteral(
                this.context().localNameOf<ExpressRouterFactoriesLocals>(
                  this.context().document(),
                  this.name(),
                  'apiKey',
                ),
              ),
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
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'adapter'),
            ),
            undefined,
            factory.createTypeReferenceNode(factory.createIdentifier(this.httpPkg.exports.ServerAdapter), [
              factory.createTypeReferenceNode(
                factory.createIdentifier(this.adapterPkg.exports.ExpressToolkit),
                undefined,
              ),
            ]),
            factory.createElementAccessExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(
                  this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'response'),
                ),
                factory.createIdentifier(ExpressFields.locals),
              ),
              factory.createStringLiteral(
                this.context().localNameOf<ExpressRouterFactoriesLocals>(
                  this.context().document(),
                  this.name(),
                  'adapterKey',
                ),
              ),
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
      this.getTypedRequestStatement(data),
      this.getCorsConfigurationStatement(data),
      this.getCorsHeadersStatement(data),
      this.getTypedResponseStatement(data),
      this.getNormalizedResponseStatement(data),
      this.getRespondStatement(data),
    ].filter((statement): statement is Statement => !isNil(statement))

    return factory.createTryStatement(
      factory.createBlock(statements, true),
      factory.createCatchClause(
        factory.createVariableDeclaration(
          factory.createIdentifier(
            this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'error'),
          ),
          undefined,
          undefined,
          undefined,
        ),
        factory.createBlock(
          [
            factory.createExpressionStatement(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ServerAdapterMethods.handleError),
                ),
                undefined,
                [
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'toolkit'),
                  ),
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'error'),
                  ),
                ],
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
    getterName: keyof typeof ServerAdapterMethods,
    type: OpenAPIGeneratorTarget,
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
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(getterName),
                ),
                [this.context().referenceOf<TypeReferenceNode>(data.operation, type)],
                [
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'toolkit'),
                  ),
                  this.context().referenceOf(data.operation, deserializer),
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
    return this.getParametersStatementAst(
      data,
      this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'query'),
      ServerAdapterMethods.getQueryParameters,
      'oats/query-type',
      'oats/query-parameters',
    )
  }

  protected getParametersParametersStatement(data: EnhancedOperation): Statement | undefined {
    if (data.path.length === 0) {
      return undefined
    }
    return this.getParametersStatementAst(
      data,
      this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'path'),
      ServerAdapterMethods.getPathParameters,
      'oats/path-type',
      'oats/path-parameters',
    )
  }

  protected getRequestHeadersParamtersStatement(data: EnhancedOperation): Statement | undefined {
    if (data.header.length === 0) {
      return undefined
    }
    return this.getParametersStatementAst(
      data,
      this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'requestHeaders'),
      ServerAdapterMethods.getRequestHeaders,
      'oats/request-headers-type',
      'oats/request-header-parameters',
    )
  }

  protected getCookieParametersStatement(data: EnhancedOperation): Statement | undefined {
    if (data.cookie.length === 0) {
      return undefined
    }
    return this.getParametersStatementAst(
      data,
      this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'cookies'),
      ServerAdapterMethods.getCookieParameters,
      'oats/cookies-type',
      'oats/cookie-parameters',
    )
  }

  protected getBodyType(data: EnhancedOperation): TypeNode {
    const bodyTypes = uniqWith(
      values(getRequestBodyContent(data, this.context()))
        .map((mediaType) => mediaType.schema)
        .filter((schema) => !isNil(schema))
        .map((schema) => this.context().referenceOf<TypeNode>(schema, 'oats/type')),
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
    const mediaTypes = Array.from(new Set(keys(getRequestBodyContent(data, this.context())))).map(
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
    if (!hasRequestBody(data, this.context())) {
      return undefined
    }
    const mimeType = this.getMimeTypeType(data)
    const bodyType = this.getBodyType(data)
    const reqBody = this.context().dereference(data.operation.requestBody, true)

    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'requestBody'),
            ),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ServerAdapterMethods.getRequestBody),
                ),
                [mimeType, bodyType],
                [
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'toolkit'),
                  ),
                  reqBody?.required ? factory.createTrue() : factory.createFalse(),
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'mimeType'),
                  ),
                  this.context().referenceOf(data.operation, 'oats/request-body-validator'),
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
    if (!hasRequestBody(data, this.context())) {
      return undefined
    }
    const mimeType = this.getMimeTypeType(data)

    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'mimeType'),
            ),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ServerAdapterMethods.getMimeType),
                ),
                [mimeType],
                [
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'toolkit'),
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

  protected getTypedRequestStatement(data: EnhancedOperation): Statement | undefined {
    const hasPath = data.path.length > 0
    const hasQuery = data.query.length > 0
    const hasHeaders = data.header.length > 0
    const hasCookie = data.cookie.length > 0
    const hasBody = hasRequestBody(data, this.context())

    if (!hasInput(data, this.context(), true)) {
      return undefined
    }

    const fields: (keyof typeof TypedRequestFields | undefined)[] = [
      hasPath ? 'path' : undefined,
      hasQuery ? 'query' : undefined,
      hasHeaders ? 'requestHeaders' : undefined,
      hasCookie ? 'cookies' : undefined,
      hasBody ? 'mimeType' : undefined,
      hasBody ? 'body' : undefined,
    ]

    const presentFields = fields.filter((f): f is keyof typeof TypedRequestFields => !isNil(f))

    const properties = presentFields.map((key) => {
      const fieldName = TypedRequestFields[key]
      const valueName = this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), key)
      return fieldName === valueName
        ? factory.createShorthandPropertyAssignment(fieldName, undefined)
        : factory.createPropertyAssignment(fieldName, factory.createIdentifier(valueName))
    })

    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'typedRequest'),
            ),
            undefined,
            factory.createTypeReferenceNode(
              this.context().referenceOf(data.operation, 'oats/request-server-type'),
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
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'typedResponse'),
            ),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'api'),
                  ),
                  this.context().localNameOf<ApiTypeLocals>(data.operation, 'oats/api-type', 'apiMethodName'),
                ),
                undefined,
                hasInput(data, this.context(), true)
                  ? [
                      factory.createIdentifier(
                        this.context().localNameOf<ExpressRouterFactoriesLocals>(
                          undefined,
                          this.name(),
                          'typedRequest',
                        ),
                      ),
                    ]
                  : [],
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
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'corsConfig'),
            ),
            undefined,
            undefined,
            data.method === 'delete'
              ? factory.createElementAccessChain(
                  factory.createElementAccessChain(
                    this.context().referenceOf(this.context().document(), 'oats/cors-configuration'),
                    factory.createToken(SyntaxKind.QuestionDotToken),
                    factory.createStringLiteral(data.url),
                  ),
                  factory.createToken(SyntaxKind.QuestionDotToken),
                  factory.createStringLiteral(data.method),
                )
              : factory.createPropertyAccessChain(
                  factory.createElementAccessChain(
                    this.context().referenceOf(this.context().document(), 'oats/cors-configuration'),
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
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'corsHeaders'),
            ),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ServerAdapterMethods.getCorsHeaders),
                ),
                undefined,
                [
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'toolkit'),
                  ),
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'corsConfig'),
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

  protected getNormalizedResponseStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'rawResponse'),
            ),
            undefined,
            factory.createTypeReferenceNode(factory.createIdentifier(this.httpPkg.exports.RawHttpResponse), undefined),
            factory.createObjectLiteralExpression(
              [
                factory.createPropertyAssignment(
                  RawHttpResponseFields.headers,
                  factory.createAwaitExpression(
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(
                          this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'adapter'),
                        ),
                        factory.createIdentifier(ServerAdapterMethods.getResponseHeaders),
                      ),
                      undefined,
                      [
                        factory.createIdentifier(
                          this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'toolkit'),
                        ),
                        factory.createIdentifier(
                          this.context().localNameOf<ExpressRouterFactoriesLocals>(
                            undefined,
                            this.name(),
                            'typedResponse',
                          ),
                        ),
                        this.context().referenceOf(data.operation, 'oats/response-header-parameters') ??
                          factory.createIdentifier('undefined'),
                        this.configuration().cors
                          ? factory.createIdentifier(
                              this.context().localNameOf<ExpressRouterFactoriesLocals>(
                                undefined,
                                this.name(),
                                'corsHeaders',
                              ),
                            )
                          : factory.createIdentifier('undefined'),
                      ],
                    ),
                  ),
                ),
                factory.createPropertyAssignment(
                  factory.createIdentifier(RawHttpResponseFields.statusCode),
                  factory.createAwaitExpression(
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(
                          this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'adapter'),
                        ),
                        factory.createIdentifier(ServerAdapterMethods.getStatusCode),
                      ),
                      undefined,
                      [
                        factory.createIdentifier(
                          this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'toolkit'),
                        ),
                        factory.createIdentifier(
                          this.context().localNameOf<ExpressRouterFactoriesLocals>(
                            undefined,
                            this.name(),
                            'typedResponse',
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                factory.createPropertyAssignment(
                  factory.createIdentifier(RawHttpResponseFields.body),
                  factory.createAwaitExpression(
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(
                          this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'adapter'),
                        ),
                        factory.createIdentifier(ServerAdapterMethods.getResponseBody),
                      ),
                      undefined,
                      [
                        factory.createIdentifier(
                          this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'toolkit'),
                        ),
                        factory.createIdentifier(
                          this.context().localNameOf<ExpressRouterFactoriesLocals>(
                            undefined,
                            this.name(),
                            'typedResponse',
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                ...(this.needsResponseCookies(data)
                  ? [
                      factory.createPropertyAssignment(
                        factory.createIdentifier(RawHttpResponseFields.cookies),
                        factory.createAwaitExpression(
                          factory.createCallExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier(
                                this.context().localNameOf<ExpressRouterFactoriesLocals>(
                                  undefined,
                                  this.name(),
                                  'adapter',
                                ),
                              ),
                              factory.createIdentifier(ServerAdapterMethods.getResponseCookies),
                            ),
                            undefined,
                            [
                              factory.createIdentifier(
                                this.context().localNameOf<ExpressRouterFactoriesLocals>(
                                  undefined,
                                  this.name(),
                                  'toolkit',
                                ),
                              ),
                              factory.createIdentifier(
                                this.context().localNameOf<ExpressRouterFactoriesLocals>(
                                  undefined,
                                  this.name(),
                                  'typedResponse',
                                ),
                              ),
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
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'adapter'),
            ),
            factory.createIdentifier(ServerAdapterMethods.respond),
          ),
          undefined,
          [
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'toolkit'),
            ),
            factory.createIdentifier(
              this.context().localNameOf<ExpressRouterFactoriesLocals>(undefined, this.name(), 'rawResponse'),
            ),
          ],
        ),
      ),
    )
  }
}
