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
import { generateSdkType } from './generateSdkType'
import { SdkGeneratorConfig } from '../typings'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class SdkTypeGenerator implements OpenAPIGenerator<'openapi/sdk-type'> {
  public static id = 'openapi/sdk-type'

  private context: OpenAPIGeneratorContext = null
  private operations: EnhancedOperation[] = []
  private sdkConfig: SdkGeneratorConfig

  public readonly id = 'openapi/sdk-type'
  public readonly consumes: OpenAPIGeneratorTarget[] = [
    'openapi/operation',
    'openapi/request-type',
    'openapi/response-type',
  ]
  public readonly runtimeDepencencies: string[] = []

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
        ? mergeTypeScriptModules([generateSdkType(document, this.operations, context, sdkConfig)])
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
    return this.operations.length > 0 ? factory.createTypeReferenceNode(nameOf(input, this.id)) : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const { context } = this
    return this.operations.length > 0 ? getModelImports(fromPath, this.id, [input], context) : []
  }
}
