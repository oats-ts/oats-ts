import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  EnhancedOperation,
} from '@oats-ts/openapi-common'
import { generateSdkClass } from './generateSdkClass'
import { SdkGeneratorConfig } from '../typings'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class SdkImplementationGenerator implements OpenAPIGenerator<'openapi/sdk-impl'> {
  private context: OpenAPIGeneratorContext = null
  private sdkConfig: SdkGeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id = 'openapi/sdk-impl'
  public readonly consumes: OpenAPIGeneratorTarget[] = [
    'openapi/operation',
    'openapi/request-type',
    'openapi/response-type',
    'openapi/sdk-type',
  ]

  public constructor(config: SdkGeneratorConfig) {
    this.sdkConfig = config
  }

  public initialize(data: OpenAPIReadOutput, config: GeneratorConfig, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, sdkConfig } = this
    const { document, nameOf } = context
    this.operations = sortBy(getEnhancedOperations(document, context), ({ operation }) =>
      nameOf(operation, 'openapi/operation'),
    )
    const data: TypeScriptModule[] =
      this.operations.length > 0
        ? mergeTypeScriptModules([generateSdkClass(document, this.operations, context, sdkConfig)])
        : []

    return {
      isOk: true,
      data,
      issues: [],
    }
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    return this.operations.length > 0 ? factory.createIdentifier(nameOf(input, this.id)) : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const { context } = this
    return this.operations.length > 0 ? getModelImports(fromPath, this.id, [input], context) : []
  }
}
