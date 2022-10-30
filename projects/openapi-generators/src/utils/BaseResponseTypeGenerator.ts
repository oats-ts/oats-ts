import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap, head, isNil, keys } from 'lodash'
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
  TypeReferenceNode,
  TypeLiteralNode,
  PropertySignature,
  TypeAliasDeclaration,
  SyntaxKind,
} from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { OperationBasedCodeGenerator } from './OperationBasedCodeGenerator'

export type ResponsePropertyName = 'mimeType' | 'statusCode' | 'body' | 'headers' | 'cookies'

export abstract class BaseResponseTypesGenerator<T = {}> extends OperationBasedCodeGenerator<T> {
  protected abstract createProperty(
    name: ResponsePropertyName,
    type: TypeNode,
    operation: EnhancedOperation,
    response: EnhancedResponse,
    context: OpenAPIGeneratorContext,
  ): PropertySignature | undefined

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: this.httpPkg.name, version }]
  }

  protected shouldGenerate({ operation }: EnhancedOperation): boolean {
    return hasResponses(operation, this.context)
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const responses = getEnhancedResponses(data.operation, this.context)
    const path = this.context.pathOf(data.operation, this.name())
    return success(
      createSourceFile(path, this.getImports(path, data, responses), [this.getResponseTypeAst(data, this.context)]),
    )
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    return hasResponses(input, this.context)
      ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasResponses(input, this.context) ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }

  protected createDefaultStatusCodeType(knownStatusCodes: string[]): TypeReferenceNode {
    const statusCodeTypeRef = factory.createTypeReferenceNode('number')

    const knownStatusCodesType = factory.createUnionTypeNode(
      knownStatusCodes.map((status) => factory.createLiteralTypeNode(factory.createNumericLiteral(status))),
    )
    return knownStatusCodes.length > 0
      ? factory.createTypeReferenceNode('Exclude', [statusCodeTypeRef, knownStatusCodesType])
      : statusCodeTypeRef
  }

  protected getImports(path: string, operation: EnhancedOperation, responses: EnhancedResponse[]): ImportDeclaration[] {
    return [
      ...flatMap(responses, ({ schema, statusCode }) => [
        ...this.context.dependenciesOf(path, schema, 'oats/type'),
        ...this.context.dependenciesOf(path, [operation.operation, statusCode], 'oats/response-headers-type'),
      ]),
    ]
  }

  protected createResponseType(
    knownStatusCodes: string[],
    context: OpenAPIGeneratorContext,
    operation: EnhancedOperation,
    response: EnhancedResponse,
  ): TypeLiteralNode {
    const { mediaType, schema, statusCode, headers } = response
    const hasResponseHeaders = keys(headers || {}).length > 0
    const hasCookies = operation.cookie.length > 0
    const statusCodeType =
      statusCode === 'default'
        ? this.createDefaultStatusCodeType(knownStatusCodes)
        : factory.createLiteralTypeNode(factory.createNumericLiteral(statusCode))

    const properties: (PropertySignature | undefined)[] = [
      this.createProperty('statusCode', statusCodeType, operation, response, context),
    ]

    if (!isNil(mediaType) && !isNil(schema)) {
      const mediaTypeType = factory.createLiteralTypeNode(factory.createStringLiteral(mediaType))
      const bodyType = context.referenceOf<TypeNode>(schema, 'oats/type')
      properties.push(this.createProperty('mimeType', mediaTypeType, operation, response, context))
      properties.push(this.createProperty('body', bodyType, operation, response, context))
    }
    if (hasResponseHeaders) {
      const headersType = factory.createTypeReferenceNode(
        context.nameOf([operation.operation, statusCode], 'oats/response-headers-type'),
      )
      properties.push(this.createProperty('headers', headersType, operation, response, context))
    }
    if (hasCookies) {
      const cookiesType = factory.createTypeReferenceNode(context.nameOf(operation.operation, 'oats/cookies-type'))
      properties.push(this.createProperty('cookies', cookiesType, operation, response, context))
    }

    return factory.createTypeLiteralNode(properties.filter((prop): prop is PropertySignature => !isNil(prop)))
  }

  getResponseTypeAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeAliasDeclaration {
    const responses = getEnhancedResponses(data.operation, context)
    const knownStatusCodes = responses.map(({ statusCode }) => statusCode).filter((s) => s !== 'default')
    const responseTypes = responses.map((response) =>
      this.createResponseType(knownStatusCodes, context, data, response),
    )

    return factory.createTypeAliasDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createIdentifier(context.nameOf(data.operation, this.name())),
      undefined,
      responseTypes.length === 1 ? head(responseTypes)! : factory.createUnionTypeNode(responseTypes),
    )
  }
}
