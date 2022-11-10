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
  Block,
  NodeFlags,
  PropertyDeclaration,
  ConstructorDeclaration,
  MethodDeclaration,
  ParameterDeclaration,
  isTypeReferenceNode,
  isIdentifier,
  ReturnStatement,
} from 'typescript'
import { createSourceFile, documentNode, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { isNil } from 'lodash'
import {
  ClientAdapterMethods,
  RawHttpRequestFields,
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
    const path = this.context().pathOf(item.operation, 'oats/operation')
    return success(createSourceFile(path, this.getImportDeclarations(path, item), [this.getOperationClassAst(item)]))
  }

  protected getImportDeclarations(path: string, item: EnhancedOperation): ImportDeclaration[] {
    return [
      getNamedImports(this.httpPkg.name, [
        this.httpPkg.imports.RawHttpRequest,
        this.httpPkg.imports.RawHttpHeaders,
        this.httpPkg.imports.HttpMethod,
        this.httpPkg.imports.ClientAdapter,
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

  private getResponseTypeAst(data: EnhancedOperation): TypeNode {
    return this.context().referenceOf<TypeReferenceNode>(data.operation, 'oats/response-type')
  }

  private getRequestTypeAst(data: EnhancedOperation): TypeNode {
    const requestType = this.context().referenceOf<TypeReferenceNode>(data.operation, 'oats/request-type')
    return isNil(requestType) ? factory.createTypeReferenceNode('never') : requestType
  }

  private getOperationClassAst(data: EnhancedOperation): Statement {
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

  private getMemberFieldsAst(data: EnhancedOperation): PropertyDeclaration[] {
    return [this.getAdapterPropertyAst(data)].filter((property): property is PropertyDeclaration => !isNil(property))
  }

  private getAdapterPropertyAst(_data: EnhancedOperation): PropertyDeclaration | undefined {
    return factory.createPropertyDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword), factory.createModifier(SyntaxKind.ReadonlyKeyword)],
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
      undefined,
      factory.createTypeReferenceNode(this.httpPkg.exports.SyncClientAdapter, undefined),
      undefined,
    )
  }

  private getConstructorAst(data: EnhancedOperation): ConstructorDeclaration {
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
              factory.createPropertyAccessExpression(
                factory.createThis(),
                this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
              ),
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

  private isNever(type: TypeNode): boolean {
    if (!isTypeReferenceNode(type) || !isIdentifier(type.typeName)) {
      return false
    }
    return type.typeName.escapedText === 'never'
  }

  private needsRequestParameter(data: EnhancedOperation): boolean {
    return !this.isNever(this.getRequestTypeAst(data))
  }

  private getRequestParameterAst(data: EnhancedOperation, isUnused: boolean = false): ParameterDeclaration {
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

  private getMethodDeclarations(data: EnhancedOperation): MethodDeclaration[] {
    const methods = [
      this.getUrlGetterMethodAst(data),
      this.getRequestMethodGetterMethodAst(data),
      this.getRequestBodyGetterMethod(data),
      this.getRequestHeaderGetterMethod(data),
      this.getRunMethodAst(data),
    ]
    return methods.filter((method): method is MethodDeclaration => !isNil(method))
  }

  private getRunMethodAst(data: EnhancedOperation): MethodDeclaration | undefined {
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
      factory.createIdentifier('run'),
      undefined,
      undefined,
      [...(needsRequestParameter ? [this.getRequestParameterAst(data, false)] : [])],
      factory.createTypeReferenceNode(factory.createIdentifier('Promise'), [this.getResponseTypeAst(data)]),
      factory.createBlock(statements, true),
    )
  }

  private getRunRawRequestStatementAst(data: EnhancedOperation): Statement | undefined {
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
        factory.createCallExpression(
          factory.createPropertyAccessExpression(factory.createThis(), factory.createIdentifier(getterName)),
          undefined,
          [...(needsRequest ? [reqParam] : [])],
        ),
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

  private getRunRawResponseStatementAst(data: EnhancedOperation): Statement {
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
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createPropertyAccessExpression(
                    factory.createThis(),
                    factory.createIdentifier(
                      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
                    ),
                  ),
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
                  ),
                ),
                undefined,
                [
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'rawRequest'),
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

  private getRunTypedResponseStatementAst(data: EnhancedOperation): Statement {
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
    const cokiesNames: [string, string] = [
      TypedResponseFields.cookies,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getResponseCookies'),
    ]

    const names: [string, string][] = [
      mimeTypeNames,
      statusCodeNames,
      ...(hasResponseHeaders(data.operation, this.context()) ? [responseHeaderNames] : []),
      // TODO hasResponseBody
      bodyNames,
      ...(data.cookie.length > 0 && this.configuration().parseSetCookieHeaders ? [cokiesNames] : []),
    ]

    const properties = names.map(([fieldName, getterName]) => {
      // TODO hasResponseBody
      const responseParam = factory.createIdentifier(
        this.context().localNameOf<OperationLocals>(undefined, this.name(), 'rawResponse'),
      )
      return factory.createPropertyAssignment(
        fieldName,
        factory.createCallExpression(
          factory.createPropertyAccessExpression(factory.createThis(), factory.createIdentifier(getterName)),
          undefined,
          [responseParam],
        ),
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

  private getRunReturnStatementAst(data: EnhancedOperation): Statement {
    return factory.createReturnStatement(
      factory.createAsExpression(
        factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'typedResponse')),
        this.getResponseTypeAst(data),
      ),
    )
  }

  private getUrlGetterMethodAst(data: EnhancedOperation): MethodDeclaration | undefined {
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

  private getQueryParametersStatement(data: EnhancedOperation): Statement | undefined {
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
              factory.createPropertyAccessExpression(
                factory.createPropertyAccessExpression(
                  factory.createThis(),
                  this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
                ),
                factory.createIdentifier(ClientAdapterMethods.getQuery),
              ),
              undefined,
              [
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
                  ),
                  factory.createIdentifier(TypedRequestFields.query),
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

  private getPathParametersStatement(data: EnhancedOperation): Statement | undefined {
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
              factory.createPropertyAccessExpression(
                factory.createPropertyAccessExpression(
                  factory.createThis(),
                  this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
                ),
                factory.createIdentifier(ClientAdapterMethods.getPath),
              ),
              undefined,
              [
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
                  ),
                  factory.createIdentifier(TypedRequestFields.path),
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

  private getRequestUrlReturnStatement(data: EnhancedOperation): ReturnStatement {
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

  private getRequestMethodGetterMethodAst(data: EnhancedOperation): MethodDeclaration | undefined {
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

  private getRequestBodyGetterMethod(data: EnhancedOperation): MethodDeclaration | undefined {
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

  private getRequestBodyReturnStatement(data: EnhancedOperation): Statement {
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

  private getRequestHeaderGetterMethod(data: EnhancedOperation): MethodDeclaration | undefined {
    const requestParam = this.getRequestParameterAst(data, !hasRequestBody(data, this.context()))
    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword)],
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getRequestHeaders'),
      undefined,
      undefined,
      this.needsRequestParameter(data) ? [requestParam] : [],
      factory.createTypeReferenceNode(this.httpPkg.exports.RawHttpHeaders),
      factory.createBlock([this.getRequestHeadersReturnStatement(data)], true),
    )
  }

  private getRequestHeadersReturnStatement(data: EnhancedOperation): Statement {
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

  private getOperationBodyAst(data: EnhancedOperation): Block {
    const statements = [
      // this.getPathParametersStatement(data),
      // this.getQueryParametersStatement(data),
      // this.getRequestUrlStatement(data),
      this.getCookiesStatement(data),
      // this.getRequestHeadersStatement(data),
      // this.getRequestBodyStatement(data),
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

  private getReturnStatement(data: EnhancedOperation): Statement | undefined {
    const responseHeaderNames: [string, string] = [
      TypedResponseFields.headers,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'responseHeaders'),
    ]
    const mimeTypeNames: [string, string] = [
      TypedResponseFields.mimeType,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'mimeType'),
    ]
    const statusCodeNames: [string, string] = [
      TypedResponseFields.statusCode,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'statusCode'),
    ]
    const bodyNames: [string, string] = [
      TypedResponseFields.body,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'responseBody'),
    ]
    const cokiesNames: [string, string] = [
      TypedResponseFields.cookies,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'responseCookies'),
    ]

    const names: [string, string][] = [
      mimeTypeNames,
      statusCodeNames,
      ...(hasResponseHeaders(data.operation, this.context()) ? [responseHeaderNames] : []),
      bodyNames,
      ...(data.cookie.length > 0 && this.configuration().parseSetCookieHeaders ? [cokiesNames] : []),
    ]

    const properties = names.map(([key, value]) => {
      return key === value
        ? factory.createShorthandPropertyAssignment(key, undefined)
        : factory.createPropertyAssignment(key, factory.createIdentifier(value))
    })

    return factory.createReturnStatement(
      factory.createAsExpression(
        factory.createObjectLiteralExpression(properties, true),
        factory.createTypeReferenceNode(this.context().referenceOf(data.operation, 'oats/response-type'), undefined),
      ),
    )
  }

  private getResponseBodyStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<OperationLocals>(undefined, this.name(), 'responseBody'),
            ),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ClientAdapterMethods.getResponseBody),
                ),
                undefined,
                [
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'rawResponse'),
                  ),
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'statusCode'),
                  ),
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'mimeType'),
                  ),
                  this.configuration().validate && hasResponses(data.operation, this.context())
                    ? this.context().referenceOf(data.operation, 'oats/response-body-validator')
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

  private getResponseCookiesStatement(data: EnhancedOperation): Statement | undefined {
    if (data.cookie.length === 0 || !this.configuration().parseSetCookieHeaders) {
      return undefined
    }
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<OperationLocals>(undefined, this.name(), 'responseCookies'),
            ),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ClientAdapterMethods.getResponseCookies),
                ),
                undefined,
                [
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'rawResponse'),
                  ),
                  this.context().referenceOf(data.operation, 'oats/set-cookie-deserializer'),
                ],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  private getResponseHeadersStatement(data: EnhancedOperation): Statement | undefined {
    if (!hasResponseHeaders(data.operation, this.context())) {
      return undefined
    }
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<OperationLocals>(undefined, this.name(), 'responseHeaders'),
            ),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ClientAdapterMethods.getResponseHeaders),
                ),
                undefined,
                [
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'rawResponse'),
                  ),
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'statusCode'),
                  ),
                  hasResponseHeaders(data.operation, this.context())
                    ? this.context().referenceOf(data.operation, 'oats/response-headers-deserializer')
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

  private getStatusCodeStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'statusCode')),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ClientAdapterMethods.getStatusCode),
                ),
                undefined,
                [
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'rawResponse'),
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

  private getMimeTypeStatement(data: EnhancedOperation): Statement | undefined {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'mimeType')),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ClientAdapterMethods.getMimeType),
                ),
                undefined,
                [
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'rawResponse'),
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

  private getRawResponseStatement(data: EnhancedOperation): Statement | undefined {
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
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ClientAdapterMethods.request),
                ),
                undefined,
                [
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'rawRequest'),
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

  private getCookiesStatement(data: EnhancedOperation): Statement | undefined {
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
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ClientAdapterMethods.getCookies),
                ),
                undefined,
                [
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(
                      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
                    ),
                    factory.createIdentifier(TypedRequestFields.cookies),
                  ),
                  this.context().referenceOf(data.operation, 'oats/cookie-serializer'),
                ],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }
}
