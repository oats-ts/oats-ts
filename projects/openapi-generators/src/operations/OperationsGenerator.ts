import { OperationObject, ParameterObject } from '@oats-ts/openapi-model'
import { OperationLocals, OperationsGeneratorConfig } from './typings'
import {
  EnhancedOperation,
  getEnhancedResponses,
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
  ReturnStatement,
  Identifier,
  PropertyAssignment,
} from 'typescript'
import {
  createSourceFile,
  createUndefined,
  documentNode,
  getModelImports,
  getNamedImports,
  getPropertyChain,
  isVoidType,
} from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { isNil } from 'lodash'
import {
  ClientAdapterMethods,
  HttpResponseFields,
  RawHttpRequestFields,
  RunnableOperationMethods,
  TypedRequestFields,
} from '../utils/OatsApiNames'
import { LocalNameDefaults } from '@oats-ts/model-common'
import { OperationDefaultLocals } from './OperationNames'
import { HttpResponse, RawHttpRequest } from '@oats-ts/openapi-http'

export class OperationsGenerator extends OperationBasedCodeGenerator<OperationsGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/operation'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    const validatorDep: OpenAPIGeneratorTarget[] = ['oats/response-body-validator']
    const cookieDeps: OpenAPIGeneratorTarget[] = ['oats/cookies-type', 'oats/cookie-parameters']
    const config = this.configuration()
    return [
      'oats/type',
      'oats/request-headers-type',
      'oats/query-type',
      'oats/path-type',
      'oats/response-type',
      'oats/request-type',
      'oats/response-headers-type',
      'oats/request-header-parameters',
      'oats/response-header-parameters',
      'oats/path-parameters',
      'oats/query-parameters',
      ...(config.sendCookieHeader ? cookieDeps : []),
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
        this.httpPkg.imports.RawHttpResponse,
        this.httpPkg.imports.RawHttpHeaders,
        this.httpPkg.imports.HttpMethod,
        this.httpPkg.imports.RunnableOperation,
        this.httpPkg.imports.ClientAdapter,
        ...(this.needsResponseCookies(item) ? [this.httpPkg.imports.SetCookieValue] : []),
      ]),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/request-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/response-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/path-parameters'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/query-parameters'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/request-header-parameters'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/response-header-parameters'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/path-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/query-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/request-headers-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/response-headers-type'),
      ...(this.configuration().validate
        ? this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/response-body-validator')
        : []),
      ...(this.configuration().sendCookieHeader && item.cookie.length > 0
        ? [
            ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/cookie-parameters'),
            ...this.context().dependenciesOf<ImportDeclaration>(path, item.operation, 'oats/cookies-type'),
          ]
        : []),
    ]
  }

  protected getResponseTypeAst(data: EnhancedOperation): TypeNode {
    const responseType = this.context().referenceOf<TypeReferenceNode>(data.operation, 'oats/response-type')
    return isNil(responseType) ? factory.createTypeReferenceNode('void') : responseType
  }

  protected getRequestTypeAst(data: EnhancedOperation): TypeNode {
    const requestType = this.context().referenceOf<TypeReferenceNode>(data.operation, 'oats/request-type')
    return isNil(requestType) ? factory.createTypeReferenceNode('void') : requestType
  }

  protected needsRequestParameter(data: EnhancedOperation): boolean {
    return !isVoidType(this.getRequestTypeAst(data))
  }

  protected needsUrl(data: EnhancedOperation): boolean {
    return true
  }

  protected needsHttpMethod(data: EnhancedOperation): boolean {
    return true
  }

  protected needsRequestHeaders(data: EnhancedOperation): boolean {
    return true
  }

  protected needsRequestBody(data: EnhancedOperation): boolean {
    return hasRequestBody(data, this.context())
  }

  protected needsResponseHeaders(data: EnhancedOperation): boolean {
    return hasResponseHeaders(data.operation, this.context())
  }

  protected needsMimeType(data: EnhancedOperation): boolean {
    return this.needsResponseBody(data)
  }

  protected needsResponseBody(data: EnhancedOperation): boolean {
    return getEnhancedResponses(data.operation, this.context()).some(
      (resp) => !isNil(resp.schema) && !isNil(resp.mediaType),
    )
  }

  protected needsResponseCookies(data: EnhancedOperation): boolean {
    return this.configuration().parseSetCookieHeaders
  }

  protected needsStatusCode(data: EnhancedOperation): boolean {
    return true
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
      factory.createTypeReferenceNode(this.httpPkg.exports.ClientAdapter, undefined),
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
          factory.createTypeReferenceNode(factory.createIdentifier(this.httpPkg.exports.ClientAdapter), undefined),
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
      this.getHttpMethodGetterMethodAst(data),
      this.getRequestHeadersGetterMethod(data),
      this.getRequestBodyGetterMethod(data),
      // Response
      this.getMimeTypeGetterAst(data),
      this.getStatusCodeGetterAst(data),
      this.getResponseHeadersGetterAst(data),
      this.getResponseBodyGetterAst(data),
      this.getResponseCookiesGetterAst(data),
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

  protected getRunRawRequestStatementAst(data: EnhancedOperation): Statement | undefined {
    const properties = this.getRunRawRequestPropertiesAst(data).filter(
      (prop): prop is PropertyAssignment => !isNil(prop),
    )

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

  private getRunRawRequestPropertiesAst(data: EnhancedOperation): (PropertyAssignment | undefined)[] {
    return [
      this.getUrlPropertyAssignmentAst(data),
      this.getMethodPropertyAssignment(data),
      this.getRequestHeadersPropertyAssignment(data),
      this.getRequestBodyPropertyAssignment(data),
    ]
  }

  protected getRunTypedResponseStatementAst(data: EnhancedOperation): Statement {
    const properties = this.getRunTypedReturnTypePropertiesAst(data).filter(
      (prop): prop is PropertyAssignment => !isNil(prop),
    )

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

  private getRunTypedReturnTypePropertiesAst(data: EnhancedOperation): (PropertyAssignment | undefined)[] {
    return [
      this.getMimeTypePropertyAssignment(data),
      this.getStatusCodePropertyAssignment(data),
      this.getResponseHeadersPropertyAssignment(data),
      this.getResponseBodyPropertyAssignment(data),
      this.getResponseCookiesPropertyAssignment(data),
    ]
  }

  protected getBasicRequestPropertyAssignmentAst(
    data: EnhancedOperation,
    field: keyof RawHttpRequest,
    getterName: OperationLocals,
  ): PropertyAssignment {
    const reqParam = factory.createIdentifier(
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
    )
    return factory.createPropertyAssignment(
      factory.createIdentifier(RawHttpRequestFields[field]),
      factory.createCallExpression(
        getPropertyChain(factory.createThis(), [
          this.context().localNameOf<OperationLocals>(undefined, this.name(), getterName),
        ]),
        undefined,
        [...(this.needsRequestParameter(data) ? [reqParam] : [])],
      ),
    )
  }

  protected getBasicResponsePropertyAssignmentAst(
    data: EnhancedOperation,
    field: keyof HttpResponse,
    getterName: OperationLocals,
  ) {
    const responseParam = factory.createIdentifier(
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'rawResponse'),
    )
    return factory.createPropertyAssignment(
      HttpResponseFields[field],
      factory.createCallExpression(
        getPropertyChain(factory.createThis(), [
          this.context().localNameOf<OperationLocals>(undefined, this.name(), getterName),
        ]),
        undefined,
        [responseParam],
      ),
    )
  }

  protected getUrlPropertyAssignmentAst(data: EnhancedOperation): PropertyAssignment | undefined {
    return this.needsUrl(data) ? this.getBasicRequestPropertyAssignmentAst(data, 'url', 'getUrl') : undefined
  }

  protected getMethodPropertyAssignment(data: EnhancedOperation): PropertyAssignment | undefined {
    return this.needsHttpMethod(data)
      ? this.getBasicRequestPropertyAssignmentAst(data, 'method', 'getHttpMethod')
      : undefined
  }

  protected getRequestBodyPropertyAssignment(data: EnhancedOperation): PropertyAssignment | undefined {
    return this.needsRequestBody(data)
      ? this.getBasicRequestPropertyAssignmentAst(data, 'body', 'getRequestBody')
      : undefined
  }

  protected getRequestHeadersPropertyAssignment(data: EnhancedOperation): PropertyAssignment | undefined {
    return this.needsRequestHeaders(data)
      ? this.getBasicRequestPropertyAssignmentAst(data, 'headers', 'getRequestHeaders')
      : undefined
  }

  protected getMimeTypePropertyAssignment(data: EnhancedOperation): PropertyAssignment | undefined {
    return this.needsMimeType(data)
      ? this.getBasicResponsePropertyAssignmentAst(data, 'mimeType', 'getMimeType')
      : undefined
  }

  protected getStatusCodePropertyAssignment(data: EnhancedOperation): PropertyAssignment | undefined {
    return this.needsStatusCode(data)
      ? this.getBasicResponsePropertyAssignmentAst(data, 'statusCode', 'getStatusCode')
      : undefined
  }

  protected getResponseBodyPropertyAssignment(data: EnhancedOperation): PropertyAssignment | undefined {
    return this.needsResponseBody(data)
      ? this.getBasicResponsePropertyAssignmentAst(data, 'body', 'getResponseBody')
      : undefined
  }

  protected getResponseCookiesPropertyAssignment(data: EnhancedOperation): PropertyAssignment | undefined {
    return this.needsResponseCookies(data)
      ? this.getBasicResponsePropertyAssignmentAst(data, 'cookies', 'getResponseCookies')
      : undefined
  }

  protected getResponseHeadersPropertyAssignment(data: EnhancedOperation): PropertyAssignment | undefined {
    return this.needsResponseHeaders(data)
      ? this.getBasicResponsePropertyAssignmentAst(data, 'headers', 'getResponseHeaders')
      : undefined
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
    if (!this.needsUrl(data)) {
      return undefined
    }
    const requestParam = this.getRequestParameterAst(data, data.query.length === 0 && data.path.length === 0)
    const statements: Statement[] = [
      this.getQueryParametersStatement(data),
      this.getPathParametersStatement(data),
      this.getUrlReturnStatement(data),
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
              [this.getGenericParameterType(data.operation, data.query, 'oats/query-type')],
              [
                getPropertyChain(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'), [
                  TypedRequestFields.query,
                ]),
                this.context().referenceOf(data.operation, 'oats/query-parameters'),
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
              [this.context().referenceOf(data.operation, 'oats/path-type')],
              [
                getPropertyChain(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'), [
                  TypedRequestFields.path,
                ]),
                this.context().referenceOf(data.operation, 'oats/path-parameters'),
              ],
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getUrlReturnStatement(data: EnhancedOperation): ReturnStatement {
    return factory.createReturnStatement(
      factory.createCallExpression(
        getPropertyChain(factory.createThis(), [
          this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
          ClientAdapterMethods.getUrl,
        ]),
        undefined,
        [
          data.path.length === 0
            ? factory.createStringLiteral(data.url)
            : factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'path')),
          data.query.length === 0
            ? createUndefined()
            : factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'query')),
        ],
      ),
    )
  }

  protected getHttpMethodGetterMethodAst(data: EnhancedOperation): MethodDeclaration | undefined {
    if (!this.needsHttpMethod(data)) {
      return undefined
    }
    const requestParam = this.getRequestParameterAst(data, true)
    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword)],
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getHttpMethod'),
      undefined,
      undefined,
      this.needsRequestParameter(data) ? [requestParam] : [],
      factory.createTypeReferenceNode(this.httpPkg.exports.HttpMethod),
      factory.createBlock([factory.createReturnStatement(factory.createStringLiteral(data.method))], true),
    )
  }

  protected getRequestBodyGetterMethod(data: EnhancedOperation): MethodDeclaration | undefined {
    if (!this.needsRequestBody(data)) {
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
        getPropertyChain(factory.createThis(), [
          this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
          ClientAdapterMethods.getRequestBody,
        ]),
        undefined,
        [
          getPropertyChain(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'), [
            TypedRequestFields.mimeType,
          ]),
          getPropertyChain(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'), [
            TypedRequestFields.body,
          ]),
        ],
      ),
    )
  }

  protected getRequestHeadersGetterMethod(data: EnhancedOperation): MethodDeclaration | undefined {
    if (!this.needsRequestHeaders(data)) {
      return undefined
    }
    const requestParam = this.getRequestParameterAst(
      data,
      data.header.length === 0 &&
        !hasRequestBody(data, this.context()) &&
        (data.cookie.length === 0 || !this.configuration().sendCookieHeader),
    )
    const statements = [this.getRequestHeadersReturnStatement(data)].filter(
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

  protected getCookieBasedRequestHeadersExpression(data: EnhancedOperation): Expression | undefined {
    if (data.cookie.length === 0 || !this.configuration().sendCookieHeader) {
      return undefined
    }
    return factory.createCallExpression(
      getPropertyChain(factory.createThis(), [
        this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
        ClientAdapterMethods.getCookieBasedRequestHeaders,
      ]),
      [this.getGenericParameterType(data.operation, data.cookie, 'oats/cookies-type')],
      [
        getPropertyChain(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'), [
          TypedRequestFields.cookies,
        ]),
        this.context().referenceOf(data.operation, 'oats/cookie-parameters'),
      ],
    )
  }

  protected getMimeTypeBasedRequestHeadersExpression(data: EnhancedOperation): Expression | undefined {
    if (!this.needsRequestBody(data)) {
      return undefined
    }
    return factory.createCallExpression(
      getPropertyChain(factory.createThis(), [
        this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
        ClientAdapterMethods.getMimeTypeBasedRequestHeaders,
      ]),
      [],
      [
        getPropertyChain(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'), [
          TypedRequestFields.mimeType,
        ]),
      ],
    )
  }

  protected getParameterBasedRequestHeadersExpression(data: EnhancedOperation): Expression | undefined {
    if (data.header.length === 0) {
      return undefined
    }
    return factory.createCallExpression(
      getPropertyChain(factory.createThis(), [
        this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
        ClientAdapterMethods.getParameterBasedRequestHeaders,
      ]),
      [this.getGenericParameterType(data.operation, data.header, 'oats/request-headers-type')],
      [
        getPropertyChain(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'), [
          TypedRequestFields.requestHeaders,
        ]),
        this.context().referenceOf(data.operation, 'oats/request-header-parameters'),
      ],
    )
  }

  protected getAuxiliaryRequestHeadersExpression(data: EnhancedOperation): Expression | undefined {
    return factory.createCallExpression(
      getPropertyChain(factory.createThis(), [
        this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
        ClientAdapterMethods.getAuxiliaryRequestHeaders,
      ]),
      [],
      [],
    )
  }

  protected getRequestHeadersReturnStatement(data: EnhancedOperation): Statement {
    const headersAsts = [
      this.getParameterBasedRequestHeadersExpression(data),
      this.getCookieBasedRequestHeadersExpression(data),
      this.getMimeTypeBasedRequestHeadersExpression(data),
      this.getAuxiliaryRequestHeadersExpression(data),
    ].filter((expr): expr is Expression => !isNil(expr))

    switch (headersAsts.length) {
      case 0:
        return factory.createReturnStatement(factory.createObjectLiteralExpression())
      case 1:
        return factory.createReturnStatement(headersAsts[0])
      default:
        return factory.createReturnStatement(
          factory.createObjectLiteralExpression(headersAsts.map((expr) => factory.createSpreadAssignment(expr))),
        )
    }
  }

  protected getLocalIdentifierAst(local: OperationLocals): Identifier {
    return factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), local))
  }

  protected getAdapterCallAst(name: keyof typeof ClientAdapterMethods, params: Expression[]): Expression {
    return factory.createCallExpression(
      getPropertyChain(factory.createThis(), [
        this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapterProperty'),
        ClientAdapterMethods[name],
      ]),
      undefined,
      params,
    )
  }

  protected getMemberCallAst(name: OperationLocals, params: Expression[]): Expression {
    return factory.createCallExpression(
      getPropertyChain(factory.createThis(), [
        this.context().localNameOf<OperationLocals>(undefined, this.name(), name),
      ]),
      undefined,
      params,
    )
  }

  protected getGenericParameterType(
    operation: OperationObject,
    parameters: ParameterObject[],
    type: OpenAPIGeneratorTarget,
  ): TypeNode {
    const baseType = this.context().referenceOf<TypeNode>(operation, type)
    if (parameters.every((param) => !param.required && param.in !== 'path')) {
      return factory.createUnionTypeNode([baseType, factory.createTypeReferenceNode(createUndefined())])
    }
    return baseType
  }

  protected getMimeTypeGetterAst(data: EnhancedOperation): MethodDeclaration | undefined {
    if (!this.needsMimeType(data)) {
      return undefined
    }
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
      [responseParam],
      factory.createUnionTypeNode([
        factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
        factory.createTypeReferenceNode(createUndefined()),
      ]),
      factory.createBlock([returnStatement], true),
    )
  }

  protected getStatusCodeGetterAst(data: EnhancedOperation): MethodDeclaration | undefined {
    if (!this.needsStatusCode(data)) {
      return undefined
    }
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
        factory.createTypeReferenceNode(createUndefined()),
      ]),
      factory.createBlock([returnStatement], true),
    )
  }

  protected getResponseBodyGetterAst(data: EnhancedOperation): MethodDeclaration | undefined {
    if (!this.needsResponseBody(data)) {
      return undefined
    }
    const responseParam = this.getRawResponseParameterAst(data)
    const returnStatement = factory.createReturnStatement(
      this.getAdapterCallAst('getResponseBody', [
        this.getLocalIdentifierAst('response'),
        this.configuration().validate && hasResponses(data.operation, this.context())
          ? this.context().referenceOf<Identifier>(data.operation, 'oats/response-body-validator')
          : createUndefined(),
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
    if (!this.needsResponseHeaders(data)) {
      return undefined
    }
    const responseParam = this.getRawResponseParameterAst(data)
    const returnStatement = factory.createReturnStatement(
      this.getAdapterCallAst('getResponseHeaders', [
        this.getLocalIdentifierAst('response'),
        this.context().referenceOf<Identifier>(data.operation, 'oats/response-header-parameters'),
      ]),
    )
    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword)],
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getResponseHeaders'),
      undefined,
      undefined,
      [responseParam],
      factory.createTypeReferenceNode(this.httpPkg.exports.RawHttpHeaders),
      factory.createBlock([returnStatement], true),
    )
  }

  protected getResponseCookiesGetterAst(data: EnhancedOperation): MethodDeclaration | undefined {
    if (!this.needsResponseCookies(data)) {
      return undefined
    }
    const responseParam = this.getRawResponseParameterAst(data)
    const returnStatement = factory.createReturnStatement(
      this.getAdapterCallAst('getResponseCookies', [this.getLocalIdentifierAst('response')]),
    )
    return factory.createMethodDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ProtectedKeyword)],
      undefined,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'getResponseCookies'),
      undefined,
      undefined,
      [responseParam],
      factory.createArrayTypeNode(factory.createTypeReferenceNode(this.httpPkg.exports.SetCookieValue)),
      factory.createBlock([returnStatement], true),
    )
  }
}
