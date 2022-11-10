import { OperationObject } from '@oats-ts/openapi-model'
import { OperationLocals, OperationsGeneratorConfig } from './typings'
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
  SyntaxKind,
  NodeFlags,
  PropertyDeclaration,
  ConstructorDeclaration,
  MethodDeclaration,
  ParameterDeclaration,
  isTypeReferenceNode,
  isIdentifier,
  ReturnStatement,
  Identifier,
} from 'typescript'
import {
  createSourceFile,
  documentNode,
  getModelImports,
  getNamedImports,
  getPropertyChain,
} from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { isNil } from 'lodash'
import {
  ClientAdapterMethods,
  RawHttpRequestFields,
  RunnableOperationMethods,
  TypedRequestFields,
  TypedResponseFields,
} from '../utils/OatsApiNames'
import { LocalNameDefaults } from '@oats-ts/model-common'
import { OperationDefaultLocals } from './OperationNames'

export class OperationsGenerator extends OperationBasedCodeGenerator<OperationsGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/operation-class'
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

  protected override getDefaultLocals(): LocalNameDefaults {
    return OperationDefaultLocals
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [
      { name: this.httpPkg.name, version },
      /* Adding this as runtime package as otherwise it's undiscoverable */
      { name: this.fetchPkg.name, version },
    ]
  }

  public referenceOf(input: OperationObject): TypeNode | Expression {
    return factory.createIdentifier(this.context().nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return getModelImports(fromPath, this.name(), [input], this.context())
  }

  protected async generateItem(item: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(item.operation, 'oats/operation-class')
    return success(createSourceFile(path, this.getImportDeclarations(path, item), [this.getOperationClassAst(item)]))
  }

  protected getImportDeclarations(path: string, item: EnhancedOperation): ImportDeclaration[] {
    return [
      getNamedImports(this.httpPkg.name, [
        this.httpPkg.imports.RawHttpRequest,
        this.httpPkg.imports.RawHttpResponse,
        this.httpPkg.imports.RawHttpHeaders,
        this.httpPkg.imports.HttpMethod,
        this.httpPkg.imports.RunnableOperation,
        this.httpPkg.imports.SyncClientAdapter,
      ]),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/request-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/response-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/path-serializer'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/query-serializer'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/request-headers-serializer'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/response-headers-deserializer'),
      ...(this.configuration().validate
        ? this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/response-body-validator')
        : []),
      ...(this.configuration().sendCookieHeader
        ? [...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/cookie-serializer')]
        : []),
      ...(this.configuration().parseSetCookieHeaders
        ? [...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/set-cookie-deserializer')]
        : []),
    ]
  }

  protected getResponseTypeAst(data: EnhancedOperation): TypeNode {
    return this.context().referenceOf<TypeReferenceNode>(data.operation, 'oats/response-type')
  }

  protected getRequestTypeAst(data: EnhancedOperation): TypeNode {
    const requestType = this.context().referenceOf<TypeReferenceNode>(data.operation, 'oats/request-type')
    return isNil(requestType) ? factory.createTypeReferenceNode('never') : requestType
  }

  protected getOperationClassAst(data: EnhancedOperation): Statement {
    const { operation } = data

    const requestType = this.getRequestTypeAst(data)
    const responseType = this.getResponseTypeAst(data)

    const classElements = [
      ...this.getMemberFieldsAst(data),
      this.getConstructorAst(data),
      ...this.getMethodDeclarations(data),
    ]

    const node = factory.createClassDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createIdentifier(this.context().nameOf(operation, this.name())),
      undefined,
      [
        factory.createHeritageClause(SyntaxKind.ImplementsKeyword, [
          factory.createExpressionWithTypeArguments(factory.createIdentifier(this.httpPkg.exports.RunnableOperation), [
            requestType,
            responseType,
          ]),
        ]),
      ],
      classElements,
    )

    return this.configuration().documentation ? documentNode(node, operation) : node
  }

  protected getMemberFieldsAst(data: EnhancedOperation): PropertyDeclaration[] {
    return [this.getAdapterPropertyAst(data)].filter((property): property is PropertyDeclaration => !isNil(property))
  }

  protected getAdapterPropertyAst(_data: EnhancedOperation): PropertyDeclaration | undefined {
    return factory.createPropertyDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword), factory.createModifier(SyntaxKind.ReadonlyKeyword)],
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
      undefined,
      factory.createTypeReferenceNode(this.httpPkg.exports.SyncClientAdapter, undefined),
      undefined,
    )
  }

  protected getConstructorAst(data: EnhancedOperation): ConstructorDeclaration {
    return factory.createConstructorDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.PublicKeyword)],
      [
        factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterParameter'),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier(this.httpPkg.exports.SyncClientAdapter), undefined),
          undefined,
        ),
      ],
      factory.createBlock(
        [
          factory.createExpressionStatement(
            factory.createBinaryExpression(
              getPropertyChain(factory.createThis(), [
                this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
              ]),
              factory.createToken(SyntaxKind.EqualsToken),
              factory.createIdentifier(
                this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterParameter'),
              ),
            ),
          ),
        ],
        true,
      ),
    )
  }

  protected isNever(type: TypeNode): boolean {
    if (!isTypeReferenceNode(type) || !isIdentifier(type.typeName)) {
      return false
    }
    return type.typeName.escapedText === 'never'
  }

  protected needsRequestParameter(data: EnhancedOperation): boolean {
    return !this.isNever(this.getRequestTypeAst(data))
  }

  protected getRequestParameterAst(data: EnhancedOperation, isUnused: boolean = false): ParameterDeclaration {
    return factory.createParameterDeclaration(
      undefined,
      undefined,
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), isUnused ? 'unusedRequest' : 'request'),
      undefined,
      this.getRequestTypeAst(data),
      undefined,
    )
  }

  protected getRawResponseParameterAst(data: EnhancedOperation): ParameterDeclaration {
    return factory.createParameterDeclaration(
      undefined,
      undefined,
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'response'),
      undefined,
      factory.createTypeReferenceNode(this.httpPkg.exports.RawHttpResponse),
      undefined,
    )
  }

  protected getMethodDeclarations(data: EnhancedOperation): MethodDeclaration[] {
    const methods = [
      // Request
      this.getUrlGetterMethodAst(data),
      this.getRequestMethodGetterMethodAst(data),
      this.getRequestBodyGetterMethod(data),
      this.getRequestHeadersGetterMethod(data),
      // Response
      this.getMimeTypeGetterAst(data),
      this.getStatusCodeGetterAst(data),
      this.getResponseBodyGetterAst(data),
      this.getResponseHeadersGetterAst(data),
      // Run
      this.getRunMethodAst(data),
    ]
    return methods.filter((method): method is MethodDeclaration => !isNil(method))
  }

  protected getRunMethodAst(data: EnhancedOperation): MethodDeclaration | undefined {
    const needsRequestParameter = this.needsRequestParameter(data)
    const statements = [
      this.getRunRawRequestStatementAst(data),
      this.getRunRawResponseStatementAst(data),
      this.getRunTypedResponseStatementAst(data),
      this.getRunReturnStatementAst(data),
    ].filter((statement): statement is Statement => !isNil(statement))

    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.PublicKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
      undefined,
      factory.createIdentifier(RunnableOperationMethods.run),
      undefined,
      undefined,
      [...(needsRequestParameter ? [this.getRequestParameterAst(data, false)] : [])],
      factory.createTypeReferenceNode(factory.createIdentifier('Promise'), [this.getResponseTypeAst(data)]),
      factory.createBlock(statements, true),
    )
  }

  protected getRunRawRequestStatementAst(data: EnhancedOperation): Statement | undefined {
    const needsRequest = this.needsRequestParameter(data)

    const urlNames: [string, string] = [
      RawHttpRequestFields.url,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getUrl'),
    ]
    const methodNames: [string, string] = [
      RawHttpRequestFields.method,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getRequestMethod'),
    ]
    const bodyNames: [string, string] = [
      RawHttpRequestFields.body,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getRequestBody'),
    ]
    const headerNames: [string, string] = [
      RawHttpRequestFields.headers,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getRequestHeaders'),
    ]

    const names = [urlNames, methodNames, ...(hasRequestBody(data, this.context()) ? [bodyNames] : []), headerNames]

    const properties = names.map(([field, getterName]) => {
      const reqParam = factory.createIdentifier(
        this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
      )
      return factory.createPropertyAssignment(
        factory.createIdentifier(field),
        factory.createCallExpression(getPropertyChain(factory.createThis(), [getterName]), undefined, [
          ...(needsRequest ? [reqParam] : []),
        ]),
      )
    })

    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'rawRequest')),
            undefined,
            factory.createTypeReferenceNode(factory.createIdentifier(this.httpPkg.exports.RawHttpRequest), undefined),
            factory.createObjectLiteralExpression(properties, true),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getRunRawResponseStatementAst(data: EnhancedOperation): Statement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<OperationLocals>(undefined, this.name(), 'rawResponse'),
            ),
            undefined,
            undefined,
            factory.createAwaitExpression(
              this.getAdapterCallAst('request', [this.getLocalIdentifierAst('rawRequest')]),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getRunTypedResponseStatementAst(data: EnhancedOperation): Statement {
    const responseHeaderNames: [string, string] = [
      TypedResponseFields.headers,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getResponseHeaders'),
    ]
    const mimeTypeNames: [string, string] = [
      TypedResponseFields.mimeType,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getMimeType'),
    ]
    const statusCodeNames: [string, string] = [
      TypedResponseFields.statusCode,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getStatusCode'),
    ]
    const bodyNames: [string, string] = [
      TypedResponseFields.body,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getResponseBody'),
    ]

    const names: [string, string][] = [
      mimeTypeNames,
      statusCodeNames,
      ...(hasResponseHeaders(data.operation, this.context()) ? [responseHeaderNames] : []),
      // TODO hasResponseBody
      bodyNames,
    ]

    const properties = names.map(([fieldName, getterName]) => {
      // TODO hasResponseBody
      const responseParam = factory.createIdentifier(
        this.context().localNameOf<OperationLocals>(undefined, this.name(), 'rawResponse'),
      )
      return factory.createPropertyAssignment(
        fieldName,
        factory.createCallExpression(getPropertyChain(factory.createThis(), [getterName]), undefined, [responseParam]),
      )
    })

    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<OperationLocals>(undefined, this.name(), 'typedResponse'),
            ),
            undefined,
            undefined,
            factory.createObjectLiteralExpression(properties, true),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getRunReturnStatementAst(data: EnhancedOperation): Statement {
    return factory.createReturnStatement(
      factory.createAsExpression(
        factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'typedResponse')),
        this.getResponseTypeAst(data),
      ),
    )
  }

  protected getUrlGetterMethodAst(data: EnhancedOperation): MethodDeclaration | undefined {
    const requestParam = this.getRequestParameterAst(data, data.query.length === 0 && data.path.length === 0)
    const statements: Statement[] = [
      this.getQueryParametersStatement(data),
      this.getPathParametersStatement(data),
      this.getRequestUrlReturnStatement(data),
    ].filter((statement): statement is Statement => !isNil(statement))
    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword)],
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getUrl'),
      undefined,
      undefined,
      this.needsRequestParameter(data) ? [requestParam] : [],
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
      factory.createBlock(statements, true),
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
            factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'query')),
            undefined,
            undefined,
            factory.createCallExpression(
              getPropertyChain(factory.createThis(), [
                this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
                ClientAdapterMethods.getQuery,
              ]),
              undefined,
              [
                getPropertyChain(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
                  ),
                  [TypedRequestFields.query],
                ),
                this.context().referenceOf(data.operation, 'oats/query-serializer'),
              ],
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
            factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'path')),
            undefined,
            undefined,
            factory.createCallExpression(
              getPropertyChain(factory.createThis(), [
                this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
                ClientAdapterMethods.getPath,
              ]),
              undefined,
              [
                getPropertyChain(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
                  ),
                  [TypedRequestFields.path],
                ),
                this.context().referenceOf(data.operation, 'oats/path-serializer'),
              ],
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getRequestUrlReturnStatement(data: EnhancedOperation): ReturnStatement {
    return factory.createReturnStatement(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createThis(),
            this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
          ),
          factory.createIdentifier(ClientAdapterMethods.getUrl),
        ),
        undefined,
        [
          data.path.length === 0
            ? factory.createStringLiteral(data.url)
            : factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'path')),
          data.query.length === 0
            ? factory.createIdentifier('undefined')
            : factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'query')),
        ],
      ),
    )
  }

  protected getRequestMethodGetterMethodAst(data: EnhancedOperation): MethodDeclaration | undefined {
    const requestParam = this.getRequestParameterAst(data, true)
    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword)],
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getRequestMethod'),
      undefined,
      undefined,
      this.needsRequestParameter(data) ? [requestParam] : [],
      factory.createTypeReferenceNode(this.httpPkg.exports.HttpMethod),
      factory.createBlock([factory.createReturnStatement(factory.createStringLiteral(data.method))], true),
    )
  }

  protected getRequestBodyGetterMethod(data: EnhancedOperation): MethodDeclaration | undefined {
    if (!hasRequestBody(data, this.context())) {
      return undefined
    }
    const requestParam = this.getRequestParameterAst(data, !hasRequestBody(data, this.context()))
    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword)],
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getRequestBody'),
      undefined,
      undefined,
      this.needsRequestParameter(data) ? [requestParam] : [],
      factory.createTypeReferenceNode('any'),
      factory.createBlock([this.getRequestBodyReturnStatement(data)], true),
    )
  }

  protected getRequestBodyReturnStatement(data: EnhancedOperation): Statement {
    return factory.createReturnStatement(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createThis(),
            this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
          ),
          factory.createIdentifier(ClientAdapterMethods.getRequestBody),
        ),
        undefined,
        [
          factory.createPropertyAccessExpression(
            factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request')),
            factory.createIdentifier(TypedRequestFields.mimeType),
          ),
          factory.createPropertyAccessExpression(
            factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request')),
            factory.createIdentifier(TypedRequestFields.body),
          ),
        ],
      ),
    )
  }

  protected getRequestHeadersGetterMethod(data: EnhancedOperation): MethodDeclaration | undefined {
    const requestParam = this.getRequestParameterAst(
      data,
      data.header.length === 0 &&
        !hasRequestBody(data, this.context()) &&
        (data.cookie.length === 0 || !this.configuration().sendCookieHeader),
    )
    const statements = [this.getCookiesStatement(data), this.getRequestHeadersReturnStatement(data)].filter(
      (statement): statement is Statement => !isNil(statement),
    )
    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword)],
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getRequestHeaders'),
      undefined,
      undefined,
      this.needsRequestParameter(data) ? [requestParam] : [],
      factory.createTypeReferenceNode(this.httpPkg.exports.RawHttpHeaders),
      factory.createBlock(statements, true),
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
            factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'cookies')),
            undefined,
            undefined,
            factory.createCallExpression(
              getPropertyChain(factory.createThis(), [
                this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
                ClientAdapterMethods.getCookies,
              ]),
              undefined,
              [
                getPropertyChain(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
                  ),
                  [TypedRequestFields.cookies],
                ),
                this.context().referenceOf(data.operation, 'oats/cookie-serializer'),
              ],
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getRequestHeadersReturnStatement(data: EnhancedOperation): Statement {
    return factory.createReturnStatement(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createThis(),
            this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
          ),
          ClientAdapterMethods.getRequestHeaders,
        ),
        undefined,
        [
          data.header.length > 0
            ? factory.createPropertyAccessExpression(
                factory.createIdentifier(
                  this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
                ),
                factory.createIdentifier(TypedRequestFields.requestHeaders),
              )
            : factory.createIdentifier('undefined'),
          hasRequestBody(data, this.context())
            ? factory.createPropertyAccessExpression(
                factory.createIdentifier(
                  this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
                ),
                factory.createIdentifier(TypedRequestFields.mimeType),
              )
            : factory.createIdentifier('undefined'),
          data.cookie.length > 0 && this.configuration().sendCookieHeader
            ? factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'cookies'))
            : factory.createIdentifier('undefined'),
          data.header.length > 0
            ? this.context().referenceOf(data.operation, 'oats/request-headers-serializer')
            : factory.createIdentifier('undefined'),
        ],
      ),
    )
  }

  protected getLocalIdentifierAst(local: OperationLocals): Identifier {
    return factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), local))
  }

  protected getAdapterCallAst(name: keyof typeof ClientAdapterMethods, params: Expression[]): Expression {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createPropertyAccessExpression(
          factory.createThis(),
          this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
        ),
        ClientAdapterMethods[name],
      ),
      undefined,
      params,
    )
  }

  protected getMemberCallAst(name: OperationLocals, params: Expression[]): Expression {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createThis(),
        this.context().localNameOf<OperationLocals>(undefined, this.name(), name),
      ),
      undefined,
      params,
    )
  }

  protected getMimeTypeGetterAst(data: EnhancedOperation): MethodDeclaration | undefined {
    const responseParam = this.getRawResponseParameterAst(data)
    const returnStatement = factory.createReturnStatement(
      this.getAdapterCallAst('getMimeType', [this.getLocalIdentifierAst('response')]),
    )
    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword)],
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getMimeType'),
      undefined,
      undefined,
      // TODO check if has response body
      [responseParam],
      factory.createUnionTypeNode([
        factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
        factory.createTypeReferenceNode('undefined'),
      ]),
      factory.createBlock([returnStatement], true),
    )
  }
  protected getStatusCodeGetterAst(data: EnhancedOperation): MethodDeclaration | undefined {
    const responseParam = this.getRawResponseParameterAst(data)
    const returnStatement = factory.createReturnStatement(
      this.getAdapterCallAst('getStatusCode', [this.getLocalIdentifierAst('response')]),
    )
    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword)],
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getStatusCode'),
      undefined,
      undefined,
      // TODO check if has response body
      [responseParam],
      factory.createUnionTypeNode([
        factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
        factory.createTypeReferenceNode('undefined'),
      ]),
      factory.createBlock([returnStatement], true),
    )
  }

  protected getResponseBodyGetterAst(data: EnhancedOperation): MethodDeclaration | undefined {
    // TODO check if has responses
    const responseParam = this.getRawResponseParameterAst(data)
    const returnStatement = factory.createReturnStatement(
      this.getAdapterCallAst('getResponseBody', [
        this.getLocalIdentifierAst('response'),
        this.getMemberCallAst('getStatusCode', [this.getLocalIdentifierAst('response')]),
        this.getMemberCallAst('getMimeType', [this.getLocalIdentifierAst('response')]),
        this.configuration().validate && hasResponses(data.operation, this.context())
          ? this.context().referenceOf<Identifier>(data.operation, 'oats/response-body-validator')
          : factory.createIdentifier('undefined'),
      ]),
    )
    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword)],
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getResponseBody'),
      undefined,
      undefined,
      // TODO check if has response body
      [responseParam],
      factory.createTypeReferenceNode('any'),
      factory.createBlock([returnStatement], true),
    )
  }

  protected getResponseHeadersGetterAst(data: EnhancedOperation): MethodDeclaration | undefined {
    if (!hasResponseHeaders(data.operation, this.context())) {
      return undefined
    }
    const responseParam = this.getRawResponseParameterAst(data)
    const returnStatement = factory.createReturnStatement(
      this.getAdapterCallAst('getResponseHeaders', [
        this.getLocalIdentifierAst('response'),
        this.getMemberCallAst('getStatusCode', [this.getLocalIdentifierAst('response')]),
        this.context().referenceOf<Identifier>(data.operation, 'oats/response-headers-deserializer'),
      ]),
    )
    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword)],
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getResponseHeaders'),
      undefined,
      undefined,
      // TODO check if has response body
      [responseParam],
      factory.createTypeReferenceNode(this.httpPkg.exports.RawHttpHeaders),
      factory.createBlock([returnStatement], true),
    )
  }
}
