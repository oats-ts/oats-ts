import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap, head, isNil, keys, values } from 'lodash'
import {
  EnhancedOperation,
  hasResponses,
  getEnhancedResponses,
  OpenAPIGeneratorContext,
  EnhancedResponse,
} from '@oats-ts/openapi-common'
import {
  Expression,
  TypeNode,
  ImportDeclaration,
  factory,
  SourceFile,
  TypeLiteralNode,
  PropertySignature,
  TypeAliasDeclaration,
  SyntaxKind,
} from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { OperationBasedCodeGenerator } from './OperationBasedCodeGenerator'
import { HttpResponseFields } from './OatsApiNames'

export abstract class BaseResponseTypesGenerator<T = {}> extends OperationBasedCodeGenerator<T> {
  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: this.httpPkg.name, version }]
  }

  protected shouldGenerate({ operation }: EnhancedOperation): boolean {
    return hasResponses(operation, this.context())
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const responses = getEnhancedResponses(data.operation, this.context())
    const path = this.context().pathOf(data.operation, this.name())
    return success(
      createSourceFile(path, this.getImports(path, data, responses), [this.getResponseTypeAst(data, this.context())]),
    )
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    return hasResponses(input, this.context())
      ? factory.createTypeReferenceNode(this.context().nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasResponses(input, this.context()) ? getModelImports(fromPath, this.name(), [input], this.context()) : []
  }

  protected shouldAimForOptional() {
    return false
  }

  protected needsCookiesProperty(operation: EnhancedOperation, response: EnhancedResponse): boolean {
    return false
  }

  protected needsMimeTypeProperty(operation: EnhancedOperation, response: EnhancedResponse): boolean {
    return !isNil(response.mediaType) && !isNil(response.schema)
  }

  protected needsBodyProperty(operation: EnhancedOperation, response: EnhancedResponse): boolean {
    return !isNil(response.mediaType) && !isNil(response.schema)
  }

  protected needsStatusCodeProperty(operation: EnhancedOperation, response: EnhancedResponse): boolean {
    return true
  }

  protected needsHeadersProperty(operation: EnhancedOperation, response: EnhancedResponse): boolean {
    return keys(response.headers || {}).length > 0
  }

  protected getImports(path: string, operation: EnhancedOperation, responses: EnhancedResponse[]): ImportDeclaration[] {
    return [
      ...flatMap(responses, ({ schema, statusCode }) => [
        ...this.context().dependenciesOf<ImportDeclaration>(path, schema, 'oats/type'),
        ...this.context().dependenciesOf<ImportDeclaration>(
          path,
          [operation.operation, statusCode],
          'oats/response-headers-type',
        ),
      ]),
    ]
  }

  protected getStatusCodeTypeAst(operation: EnhancedOperation, response: EnhancedResponse): TypeNode {
    if (response.statusCode === 'default') {
      const knownStatusCodes = getEnhancedResponses(operation.operation, this.context())
        .map(({ statusCode }) => statusCode)
        .filter((statusCode) => statusCode !== 'default')

      const statusCodeTypeRef = factory.createTypeReferenceNode('number')

      const knownStatusCodesType = factory.createUnionTypeNode(
        knownStatusCodes.map((status) => factory.createLiteralTypeNode(factory.createNumericLiteral(status))),
      )
      return knownStatusCodes.length > 0
        ? factory.createTypeReferenceNode('Exclude', [statusCodeTypeRef, knownStatusCodesType])
        : statusCodeTypeRef
    }
    return factory.createLiteralTypeNode(factory.createNumericLiteral(response.statusCode))
  }

  protected getStatusCodePropertyAst(
    operation: EnhancedOperation,
    response: EnhancedResponse,
  ): PropertySignature | undefined {
    if (this.needsStatusCodeProperty(operation, response)) {
      const statusCodeType = this.getStatusCodeTypeAst(operation, response)
      return factory.createPropertySignature(undefined, HttpResponseFields.statusCode, undefined, statusCodeType)
    }
    return undefined
  }

  protected getMimeTypePropertyAst(
    operation: EnhancedOperation,
    response: EnhancedResponse,
  ): PropertySignature | undefined {
    if (this.needsMimeTypeProperty(operation, response)) {
      const type = factory.createLiteralTypeNode(factory.createStringLiteral(response.mediaType!))
      return factory.createPropertySignature(undefined, HttpResponseFields.mimeType, undefined, type)
    }
    return undefined
  }

  protected getBodyPropertyAst(
    operation: EnhancedOperation,
    response: EnhancedResponse,
  ): PropertySignature | undefined {
    if (this.needsBodyProperty(operation, response)) {
      const type = this.context().referenceOf<TypeNode>(response.schema, 'oats/type')
      return factory.createPropertySignature(undefined, HttpResponseFields.body, undefined, type)
    }
    return undefined
  }

  protected getHeadersPropertyAst(
    operation: EnhancedOperation,
    response: EnhancedResponse,
  ): PropertySignature | undefined {
    if (this.needsHeadersProperty(operation, response)) {
      const isOptional = values(response.headers)
        .map((header) => this.context().dereference(header, true))
        .every((header) => !header.required)
      const type = factory.createTypeReferenceNode(
        this.context().nameOf([operation.operation, response.statusCode], 'oats/response-headers-type'),
      )
      const questionToken =
        isOptional && this.shouldAimForOptional() ? factory.createToken(SyntaxKind.QuestionToken) : undefined
      return factory.createPropertySignature(undefined, HttpResponseFields.headers, questionToken, type)
    }
    return undefined
  }

  protected getCookiesPropertyAst(
    operation: EnhancedOperation,
    response: EnhancedResponse,
  ): PropertySignature | undefined {
    if (this.needsCookiesProperty(operation, response)) {
      const type = factory.createArrayTypeNode(factory.createTypeReferenceNode(this.httpPkg.exports.SetCookieValue))
      const questionToken = this.shouldAimForOptional() ? factory.createToken(SyntaxKind.QuestionToken) : undefined
      return factory.createPropertySignature(undefined, HttpResponseFields.cookies, questionToken, type)
    }
    return undefined
  }

  protected getResponseType(operation: EnhancedOperation, response: EnhancedResponse): TypeLiteralNode {
    const properties = [
      this.getStatusCodePropertyAst(operation, response),
      this.getMimeTypePropertyAst(operation, response),
      this.getBodyPropertyAst(operation, response),
      this.getHeadersPropertyAst(operation, response),
      this.getCookiesPropertyAst(operation, response),
    ]

    return factory.createTypeLiteralNode(properties.filter((prop): prop is PropertySignature => !isNil(prop)))
  }

  protected getResponseTypeAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeAliasDeclaration {
    const responses = getEnhancedResponses(data.operation, context)
    const responseTypes = responses.map((response) => this.getResponseType(data, response))

    return factory.createTypeAliasDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createIdentifier(context.nameOf(data.operation, this.name())),
      undefined,
      responseTypes.length === 1 ? head(responseTypes)! : factory.createUnionTypeNode(responseTypes),
    )
  }
}
