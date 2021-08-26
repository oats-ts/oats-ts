import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { AsyncAPIReadOutput } from '@oats-ts/asyncapi-reader'
import { sortBy } from 'lodash'
import { AsyncAPIGeneratorTarget } from '@oats-ts/asyncapi'
import {
  AsyncAPIGenerator,
  AsyncAPIGeneratorContext,
  createAsyncAPIGeneratorContext,
  getEnhancedChannels,
} from '@oats-ts/asyncapi-common'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { ImportDeclaration, TypeNode, Expression, factory } from 'typescript'
import { ApiGeneratorConfig } from './types'
import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { generateApiType } from './apiType/generateApiType'
import { generateApiClass } from './apiClass/generateApiClass'
import { generateApiStub } from './apiStub/generateApiStub'
import { getModelImports } from '@oats-ts/typescript-common'

export class ApiGenerator implements AsyncAPIGenerator {
  public static id = 'asyncapi/channels'
  private static consumes: AsyncAPIGeneratorTarget[] = ['asyncapi/type']
  private static produces: AsyncAPIGeneratorTarget[] = ['asyncapi/api-type', 'asyncapi/api-stub', 'asyncapi/api-class']

  private context: AsyncAPIGeneratorContext = null
  private config: GeneratorConfig & ApiGeneratorConfig

  public readonly id: string = ApiGenerator.id
  public readonly produces: string[] = ApiGenerator.produces
  public readonly consumes: string[] = ApiGenerator.consumes

  constructor(config: GeneratorConfig & ApiGeneratorConfig) {
    this.config = config
    this.produces = ApiGenerator.produces.filter((target) => {
      switch (target) {
        case 'asyncapi/api-type':
          return config.type
        case 'asyncapi/api-class':
          return config.class
        case 'asyncapi/api-stub':
          return config.stub
        default:
          return false
      }
    })
  }

  initialize(data: AsyncAPIReadOutput, generators: AsyncAPIGenerator[]): void {
    this.context = createAsyncAPIGeneratorContext(data, this.config, generators)
  }

  async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const { nameOf, document } = context
    const channels = sortBy(getEnhancedChannels(context.document, context), ({ channel }) =>
      nameOf(channel, 'asyncapi/channel-factory'),
    )
    const data: TypeScriptModule[] = mergeTypeScriptModules([
      ...(config.type ? [generateApiType(document, channels, context, config)] : []),
      ...(config.class ? [generateApiClass(document, channels, context, config)] : []),
      ...(config.stub ? [generateApiStub(document, channels, context, config)] : []),
    ])
    return {
      isOk: true,
      issues: [],
      data,
    }
  }

  public referenceOf(input: AsyncApiObject, target: AsyncAPIGeneratorTarget): TypeNode | Expression {
    const { context, config } = this
    const { nameOf } = context
    switch (target) {
      case 'asyncapi/api-type': {
        return config.type ? factory.createTypeReferenceNode(nameOf(input, target)) : undefined
      }
      case 'asyncapi/api-class': {
        return config.class ? factory.createIdentifier(nameOf(input, target)) : undefined
      }
      case 'asyncapi/api-stub': {
        return config.stub ? factory.createIdentifier(nameOf(input, target)) : undefined
      }
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: AsyncApiObject, target: AsyncAPIGeneratorTarget): ImportDeclaration[] {
    const { context, config } = this
    switch (target) {
      case 'asyncapi/api-type': {
        return config.type ? getModelImports(fromPath, target, [input], context) : []
      }
      case 'asyncapi/api-class': {
        return config.class ? getModelImports(fromPath, target, [input], context) : []
      }
      case 'asyncapi/api-stub': {
        return config.stub ? getModelImports(fromPath, target, [input], context) : []
      }
      default:
        return []
    }
  }
}
