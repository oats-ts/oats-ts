import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { generateSdkStub } from './generateSdkStub'
import { SdkStubGeneratorConfig } from './typings'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class SdkStubGenerator implements OpenAPIGenerator {
  public static id = 'openapi/sdk-stub'
  private static consumes: OpenAPIGeneratorTarget[] = [
    'openapi/operation',
    'openapi/request-type',
    'openapi/response-type',
    'openapi/sdk-type',
  ]
  private static produces: OpenAPIGeneratorTarget[] = ['openapi/sdk-stub']

  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & SdkStubGeneratorConfig

  public readonly id: string = SdkStubGenerator.id
  public readonly produces: string[] = SdkStubGenerator.produces
  public readonly consumes: string[] = SdkStubGenerator.consumes

  public constructor(config: GeneratorConfig & SdkStubGeneratorConfig) {
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const { document, nameOf } = context
    const operations = sortBy(getEnhancedOperations(document, context), ({ operation }) =>
      nameOf(operation, 'openapi/operation'),
    )
    const data: TypeScriptModule[] = mergeTypeScriptModules([generateSdkStub(document, operations, context, config)])

    return {
      isOk: true,
      data,
      issues: [],
    }
  }

  public referenceOf(input: OpenAPIObject, target: OpenAPIGeneratorTarget): TypeNode | Expression {
    const { context, config } = this
    const { nameOf } = context
    switch (target) {
      case 'openapi/sdk-stub': {
        return factory.createIdentifier(nameOf(input, target))
      }
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context, config } = this
    switch (target) {
      case 'openapi/sdk-stub': {
        return getModelImports(fromPath, target, [input], context)
      }
      default:
        return []
    }
  }
}
