import {
  EnhancedOperation,
  EnhancedPathItem,
  getResponseHeaders,
  hasResponses,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import {
  factory,
  ImportDeclaration,
  SourceFile,
  Identifier,
  Statement,
  SyntaxKind,
  NodeFlags,
  Expression,
} from 'typescript'
import { createSourceFile, documentNode, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { CorsConfigurationGeneratorConfig } from './typings'
import { PathBasedCodeGenerator } from '../utils/PathBasedCodeGenerator'
import { Issue } from '@oats-ts/validators'
import { flatMap, isNil } from 'lodash'
import { OperationCorsConfigurationFields } from '../utils/OatsApiNames'

export class CorsConfigurationGenerator extends PathBasedCodeGenerator<CorsConfigurationGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/cors-configuration'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return []
  }
  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: this.httpPkg.name, version }]
  }

  public getPreGenerateIssues(): Issue[] {
    const { items } = this
    // No paths we don't care
    if (items.length === 0) {
      return []
    }
    const [paths] = items
    // If we don't have any CORS enabled operations we complain
    if (this.getCorsEnabledPaths(paths).length === 0) {
      return [
        {
          message: `No paths enabled for CORS by configuration`,
          path: this.name(),
          severity: 'warning',
        },
      ]
    }
    return []
  }

  public referenceOf(input: OpenAPIObject): Identifier | undefined {
    const [paths] = this.items
    return paths?.length > 0 ? factory.createIdentifier(this.context().nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: any): ImportDeclaration[] {
    const [paths] = this.items
    return paths?.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context()) : []
  }

  protected async generateItem(paths: EnhancedPathItem[]): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(this.context().document(), this.name())
    return success(createSourceFile(path, this.getImportDeclarations(), [this.getCorsConfigurationStatement(paths)]))
  }

  protected getImportDeclarations(): ImportDeclaration[] {
    return [getNamedImports(this.httpPkg.name, [this.httpPkg.imports.CorsConfiguration])]
  }

  protected getConfigurationWarningLabel(): string {
    const label = `WARNING: No allowed origin + method combination for any operations, generator "${this.name()}" likely needs to be configured!

    - If you don't need CORS, remove "${this.name()}" from your configuration.
    - If you need CORS, please provide at least the getAllowedOrigins options for "${this.name()}".
    - More info on CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    - More info on configuring generators: https://oats-ts.github.io/docs/#/docs/OpenAPI_Generate`
    return label
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
  }

  protected getCorsConfigurationStatement(paths: EnhancedPathItem[]): Statement {
    const statement = factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            this.context().nameOf(this.context().document(), this.name()),
            undefined,
            factory.createTypeReferenceNode(this.httpPkg.exports.CorsConfiguration),
            this.getCorsObjectAst(paths),
          ),
        ],
        NodeFlags.Const,
      ),
    )
    if (this.getCorsEnabledPaths(paths).length === 0) {
      return documentNode(statement, { description: this.getConfigurationWarningLabel() })
    }
    return statement
  }

  protected getCorsObjectAst(data: EnhancedPathItem[]): Expression | undefined {
    const properties = flatMap(data, (path) => {
      const corsExpression = this.getPathCorsObjectAst(path)
      if (isNil(corsExpression)) {
        return []
      }
      return [factory.createPropertyAssignment(factory.createStringLiteral(path.url), corsExpression)]
    })

    return factory.createObjectLiteralExpression(properties, true)
  }

  protected getPathCorsObjectAst(data: EnhancedPathItem): Expression | undefined {
    const { operations } = data
    const config = this.configuration()

    const properties = flatMap(operations, (operation) => {
      if (!config.isMethodAllowed(operation.url, operation.method, operation.operation)) {
        return []
      }
      return [factory.createPropertyAssignment(operation.method, this.getOperationCorsObjectAst(operation))]
    })

    if (properties.length === 0) {
      return undefined
    }
    return factory.createObjectLiteralExpression(properties, true)
  }

  protected getAllowedOriginsAst(data: EnhancedOperation): Expression {
    const { getAllowedOrigins } = this.configuration()
    const allowedOrigins = getAllowedOrigins(data.url, data.method, data.operation)
    if (allowedOrigins === false) {
      return factory.createFalse()
    }
    if (allowedOrigins === true) {
      return factory.createTrue()
    }
    if (Array.isArray(allowedOrigins)) {
      return factory.createArrayLiteralExpression(allowedOrigins.map((origin) => factory.createStringLiteral(origin)))
    }
    return factory.createFalse()
  }

  protected getAllowedResponseHeadersAst(data: EnhancedOperation): Expression {
    const { isResponseHeaderAllowed } = this.configuration()
    const responseHeaders = this.getResponseHeaderNames(data).filter((header) =>
      isResponseHeaderAllowed(header, data.url, data.method, data.operation),
    )
    return factory.createArrayLiteralExpression(responseHeaders.map((header) => factory.createStringLiteral(header)))
  }

  protected getAllowedRequestHeadersAst(data: EnhancedOperation): Expression {
    const { isRequestHeaderAllowed } = this.configuration()
    const requestHeaders = this.getRequestHeaderNames(data).filter((header) =>
      isRequestHeaderAllowed(header, data.url, data.method, data.operation),
    )
    return factory.createArrayLiteralExpression(requestHeaders.map((header) => factory.createStringLiteral(header)))
  }

  protected getAllowCredentialsAst(data: EnhancedOperation): Expression {
    const { isCredentialsAllowed } = this.configuration()
    const allowed = isCredentialsAllowed(data.url, data.method, data.operation)
    return allowed ? factory.createTrue() : factory.createFalse()
  }

  protected getMaxAgeAst(data: EnhancedOperation): Expression {
    const { getMaxAge } = this.configuration()
    const maxAge = getMaxAge(data.url, data.method, data.operation)
    return isNil(maxAge) ? factory.createIdentifier('undefined') : factory.createNumericLiteral(maxAge)
  }

  protected getOperationCorsObjectAst(data: EnhancedOperation): Expression {
    const allowedOriginsAst = this.getAllowedOriginsAst(data)
    const allowedRequestHeadersAst = this.getAllowedRequestHeadersAst(data)
    const allowedResponseHeadersAst = this.getAllowedResponseHeadersAst(data)
    const allowCredentialsAst = this.getAllowCredentialsAst(data)
    const maxAgeAst = this.getMaxAgeAst(data)

    return factory.createObjectLiteralExpression(
      [
        factory.createPropertyAssignment(OperationCorsConfigurationFields.allowedOrigins, allowedOriginsAst),
        factory.createPropertyAssignment(
          OperationCorsConfigurationFields.allowedRequestHeaders,
          allowedRequestHeadersAst,
        ),
        factory.createPropertyAssignment(
          OperationCorsConfigurationFields.allowedResponseHeaders,
          allowedResponseHeadersAst,
        ),
        factory.createPropertyAssignment(OperationCorsConfigurationFields.allowCredentials, allowCredentialsAst),
        factory.createPropertyAssignment(OperationCorsConfigurationFields.maxAge, maxAgeAst),
      ],
      true,
    )
  }

  protected getResponseHeaderNames(data: EnhancedOperation): string[] {
    const headers = flatMap(Object.values(getResponseHeaders(data.operation, this.context())), (headersObject) =>
      Object.keys(headersObject),
    ).map((header) => header.toLowerCase())

    if (hasResponses(data.operation, this.context())) {
      headers.push('content-type')
    }
    return headers
  }

  protected getRequestHeaderNames(data: EnhancedOperation): string[] {
    const headers = data.header.map((param) => param.name?.toLowerCase())
    if (!isNil(data.operation.requestBody)) {
      headers.push('content-type')
    }
    return headers
  }

  protected getCorsEnabledPaths(paths: EnhancedPathItem[]) {
    return paths.filter(({ operations }) => operations.some((operation) => this.isOperationCorsEnabled(operation)))
  }

  protected isOperationCorsEnabled(data: EnhancedOperation) {
    const { url, method, operation } = data
    const config = this.configuration()
    const allowedOrigins = config.getAllowedOrigins(url, method, operation)
    const isMethodAllowed = config.isMethodAllowed(url, method, operation)
    if (!isMethodAllowed) {
      return false
    }
    if (typeof allowedOrigins === 'boolean') {
      return allowedOrigins
    }
    return allowedOrigins.length > 0
  }
}
