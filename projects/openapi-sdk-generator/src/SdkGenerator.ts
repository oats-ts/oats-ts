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
import { generateSdkClass } from './implementation/generateSdkClass'
import { generateSdkStub } from './stub/generateSdkStub'
import { generateSdkType } from './type/generateSdkType'
import { SdkGeneratorConfig } from './typings'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class SdkGenerator implements OpenAPIGenerator {
  public static id = 'openapi/validators'
  private static consumes: OpenAPIGeneratorTarget[] = ['openapi/operation', 'openapi/request-type']
  private static produces: OpenAPIGeneratorTarget[] = [
    'openapi/sdk-implementation',
    'openapi/sdk-stub',
    'openapi/sdk-type',
  ]

  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & SdkGeneratorConfig

  public readonly id: string = SdkGenerator.id
  public readonly produces: string[] = SdkGenerator.produces
  public readonly consumes: string[] = SdkGenerator.consumes

  public constructor(config: GeneratorConfig & SdkGeneratorConfig) {
    this.config = config
    this.produces = SdkGenerator.produces.filter((target) => {
      switch (target) {
        case 'openapi/sdk-type':
          return config.type
        case 'openapi/sdk-implementation':
          return config.implementation
        case 'openapi/sdk-stub':
          return config.stub
        default:
          return false
      }
    })
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
    const data: TypeScriptModule[] = mergeTypeScriptModules([
      ...(config.type ? [generateSdkType(document, operations, context, config)] : []),
      ...(config.implementation ? [generateSdkClass(document, operations, context, config)] : []),
      ...(config.stub ? [generateSdkStub(document, operations, context, config)] : []),
    ])

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
      case 'openapi/sdk-type': {
        return config.type ? factory.createTypeReferenceNode(nameOf(input, target)) : undefined
      }
      case 'openapi/sdk-implementation': {
        return config.implementation ? factory.createIdentifier(nameOf(input, target)) : undefined
      }
      case 'openapi/sdk-stub': {
        return config.stub ? factory.createIdentifier(nameOf(input, target)) : undefined
      }
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context, config } = this
    switch (target) {
      case 'openapi/sdk-type': {
        return config.type ? getModelImports(fromPath, target, [input], context) : []
      }
      case 'openapi/sdk-implementation': {
        return config.implementation ? getModelImports(fromPath, target, [input], context) : []
      }
      case 'openapi/sdk-stub': {
        return config.stub ? getModelImports(fromPath, target, [input], context) : []
      }
      default:
        return []
    }
  }
}
