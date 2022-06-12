import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { flatMap, isNil, keys, negate, sortBy, values } from 'lodash'
import {
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  EnhancedOperation,
  getEnhancedOperations,
  hasResponseHeaders,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { ParameterTypesGeneratorConfig, ResponseParameterInput } from '../utils/parameters/typings'
import { BaseCodeGenerator } from '@oats-ts/generator'
import { TypeNode, ImportDeclaration, factory, SourceFile, SyntaxKind } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { getResponseHeaders } from '@oats-ts/openapi-common'
import { success, Try } from '@oats-ts/try'
import { ResponsesObject } from '@oats-ts/openapi-model'
import { getParameterTypeLiteralAst } from '../utils/parameters/getParameterTypeLiteralAst'

const EmptyResponsesObject: ResponsesObject = { default: undefined }

type ResponseParameterInputInternal = [EnhancedOperation, string]

export class ResponseHeadersTypesGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  ResponseParameterInputInternal,
  OpenAPIGeneratorContext
> {
  public constructor(private readonly config: ParameterTypesGeneratorConfig) {
    super()
  }

  public name(): OpenAPIGeneratorTarget {
    return 'openapi/response-headers-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['json-schema/type']
  }

  public runtimeDependencies(): string[] {
    return []
  }

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): ResponseParameterInputInternal[] {
    const operations = sortBy(getEnhancedOperations(this.input.document, this.context), ({ operation }) =>
      this.context.nameOf(operation),
    )
    return flatMap(operations, (operation: EnhancedOperation): ResponseParameterInputInternal[] => {
      if (!hasResponseHeaders(operation.operation, this.context)) {
        return []
      }
      return keys(getResponseHeaders(operation.operation, this.context)).map(
        (status): ResponseParameterInputInternal => [operation, status],
      )
    })
  }
  protected async generateItem([data, status]: ResponseParameterInputInternal): Promise<Try<SourceFile>> {
    const { operation } = data
    const fromPath = this.context.pathOf([operation, status], this.name())
    const headers = values(getResponseHeaders(operation, this.context)[status]).map((header) =>
      this.context.dereference(header, true),
    )
    const types = headers.map((header) => header.schema).filter(negate(isNil))
    return success(
      createSourceFile(
        fromPath,
        [...flatMap(types, (type) => this.context.dependenciesOf(fromPath, type, 'json-schema/type'))],
        [
          factory.createTypeAliasDeclaration(
            [],
            [factory.createModifier(SyntaxKind.ExportKeyword)],
            this.context.nameOf([operation, status], this.name()),
            undefined,
            getParameterTypeLiteralAst(headers, this.context, this.config),
          ),
        ],
      ),
    )
  }

  private hasResponsesHeaders([operation, status]: ResponseParameterInput) {
    const responseOrRef = (operation.responses ?? EmptyResponsesObject)[status]
    if (isNil(responseOrRef)) {
      return false
    }
    const response = this.context.dereference(responseOrRef, true)
    const headers = response.headers || {}
    return values(headers).length > 0
  }

  public referenceOf(input: ResponseParameterInput): TypeNode {
    if (isNil(input) || !Array.isArray(input)) {
      return undefined
    }
    return !this.hasResponsesHeaders(input)
      ? factory.createTypeReferenceNode('undefined')
      : factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: ResponseParameterInput): ImportDeclaration[] {
    return isNil(input) || !Array.isArray(input) || !this.hasResponsesHeaders(input)
      ? []
      : getModelImports(fromPath, this.name(), [input], this.context)
  }
}
