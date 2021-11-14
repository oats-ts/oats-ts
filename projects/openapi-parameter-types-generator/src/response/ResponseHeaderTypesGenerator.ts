import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { flatMap, isEmpty, isNil, keys, sortBy, values } from 'lodash'
import {
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  EnhancedOperation,
  getEnhancedOperations,
  hasResponseHeaders,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { ParameterTypesGeneratorConfig, ResponseParameterInput } from '../typings'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { getResponseHeaders } from '@oats-ts/openapi-common'
import { generateResponseHeaderType } from './generateResponseHeaderType'

export class ResponseHeaderTypesGenerator implements OpenAPIGenerator<'openapi/response-headers-type'> {
  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & ParameterTypesGeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id = 'openapi/response-headers-type'
  public readonly consumes: OpenAPIGeneratorTarget[] = ['openapi/type']

  public constructor(config: GeneratorConfig & ParameterTypesGeneratorConfig) {
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
    const { document, nameOf } = this.context
    this.operations = sortBy(getEnhancedOperations(document, this.context), ({ operation }) => nameOf(operation))
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context } = this
    const data = flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] => {
      if (!hasResponseHeaders(operation.operation, context)) {
        return []
      }
      return keys(getResponseHeaders(operation.operation, context)).map((status) =>
        generateResponseHeaderType(operation, status, context, this.config),
      )
    })
    return {
      data,
      isOk: true,
      issues: [],
    }
  }

  private hasResponsesHeaders([operation, status]: ResponseParameterInput) {
    const { context } = this
    const { dereference } = context
    const responseOrRef = (operation.responses || {})[status]
    if (isNil(responseOrRef)) {
      return false
    }
    const response = dereference(responseOrRef, true)
    const headers = response.headers || {}
    return values(headers).length > 0
  }

  public referenceOf(input: ResponseParameterInput): TypeNode {
    const { context } = this
    const { nameOf } = context
    if (isNil(input) || !Array.isArray(input)) {
      return undefined
    }
    return !this.hasResponsesHeaders(input)
      ? factory.createTypeReferenceNode('undefined')
      : factory.createTypeReferenceNode(nameOf(input, 'openapi/response-headers-type'))
  }

  public dependenciesOf(fromPath: string, input: ResponseParameterInput): ImportDeclaration[] {
    const { context } = this
    return isNil(input) || !Array.isArray(input) || !this.hasResponsesHeaders(input)
      ? []
      : getModelImports(fromPath, this.id, [input], context)
  }
}
