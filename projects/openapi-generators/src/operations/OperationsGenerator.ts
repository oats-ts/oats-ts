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
  ParameterDeclaration,
  SyntaxKind,
  Block,
  NodeFlags,
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

  protected getDefaultLocals(): LocalNameDefaults {
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
    return success(createSourceFile(path, this.getImportDeclarations(path, item), [this.getOperationFunctionAst(item)]))
  }

  protected getImportDeclarations(path: string, item: EnhancedOperation): ImportDeclaration[] {
    return [
      getNamedImports(this.httpPkg.name, [this.httpPkg.imports.RawHttpRequest, this.httpPkg.imports.ClientAdapter]),
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

  protected getOperationFunctionAst(data: EnhancedOperation): Statement {
    const { operation } = data

    const responseType = this.context().referenceOf<TypeReferenceNode>(operation, 'oats/response-type')
    const requestType = this.context().referenceOf<TypeReferenceNode>(operation, 'oats/request-type')
    const params: ParameterDeclaration[] = [
      ...(isNil(requestType)
        ? []
        : [
            factory.createParameterDeclaration(
              [],
              [],
              undefined,
              this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
              undefined,
              requestType,
            ),
          ]),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
        undefined,
        factory.createTypeReferenceNode(this.httpPkg.exports.ClientAdapter),
      ),
    ]

    const node = factory.createFunctionDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
      undefined,
      this.context().nameOf(operation, 'oats/operation'),
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

  protected getResponseBodyStatement(data: EnhancedOperation): Statement | undefined {
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

  protected getResponseCookiesStatement(data: EnhancedOperation): Statement | undefined {
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

  protected getResponseHeadersStatement(data: EnhancedOperation): Statement | undefined {
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

  protected getStatusCodeStatement(data: EnhancedOperation): Statement | undefined {
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

  protected getMimeTypeStatement(data: EnhancedOperation): Statement | undefined {
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

  protected getRawResponseStatement(data: EnhancedOperation): Statement | undefined {
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

  protected getRawRequestStatement(data: EnhancedOperation): Statement | undefined {
    const urlNames: [string, string] = [
      RawHttpRequestFields.url,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'requestUrl'),
    ]
    const methodNames: [string, Expression] = [RawHttpRequestFields.method, factory.createStringLiteral(data.method)]
    const bodyNames: [string, string] = [
      RawHttpRequestFields.body,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'requestBody'),
    ]
    const headerNames: [string, string] = [
      RawHttpRequestFields.headers,
      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'requestHeaders'),
    ]

    const names = [urlNames, methodNames, ...(hasRequestBody(data, this.context()) ? [bodyNames] : []), headerNames]

    const properties = names.map(([key, value]) => {
      return key === value
        ? factory.createShorthandPropertyAssignment(key, undefined)
        : factory.createPropertyAssignment(key, typeof value === 'string' ? factory.createIdentifier(value) : value)
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

  protected getRequestBodyStatement(data: EnhancedOperation): Statement | undefined {
    if (!hasRequestBody(data, this.context())) {
      return undefined
    }
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<OperationLocals>(undefined, this.name(), 'requestBody'),
            ),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ClientAdapterMethods.getRequestBody),
                ),
                undefined,
                [
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(
                      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
                    ),
                    factory.createIdentifier(TypedRequestFields.mimeType),
                  ),
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(
                      this.context().localNameOf<OperationLocals>(undefined, this.name(), 'request'),
                    ),
                    factory.createIdentifier(TypedRequestFields.body),
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
            factory.createIdentifier(
              this.context().localNameOf<OperationLocals>(undefined, this.name(), 'requestHeaders'),
            ),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ClientAdapterMethods.getRequestHeaders),
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
                    ? factory.createIdentifier(
                        this.context().localNameOf<OperationLocals>(undefined, this.name(), 'cookies'),
                      )
                    : factory.createIdentifier('undefined'),
                  data.header.length > 0
                    ? this.context().referenceOf(data.operation, 'oats/request-headers-serializer')
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

  protected getRequestUrlStatement(data: EnhancedOperation) {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.context().localNameOf<OperationLocals>(undefined, this.name(), 'requestUrl')),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ClientAdapterMethods.getUrl),
                ),
                undefined,
                [
                  data.path.length === 0
                    ? factory.createStringLiteral(data.url)
                    : factory.createIdentifier(
                        this.context().localNameOf<OperationLocals>(undefined, this.name(), 'path'),
                      ),
                  data.query.length === 0
                    ? factory.createIdentifier('undefined')
                    : factory.createIdentifier(
                        this.context().localNameOf<OperationLocals>(undefined, this.name(), 'query'),
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
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
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
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<OperationLocals>(undefined, this.name(), 'adapter'),
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
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }
}
