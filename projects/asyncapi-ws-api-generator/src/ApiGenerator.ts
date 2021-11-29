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

export class ApiGenerator implements AsyncAPIGenerator<'asyncapi/api-type'> {
  private context: AsyncAPIGeneratorContext = null
  private config: ApiGeneratorConfig

  public readonly id = 'asyncapi/api-type'
  public readonly consumes: AsyncAPIGeneratorTarget[] = ['asyncapi/api-type', 'asyncapi/api-stub', 'asyncapi/api-class']

  constructor(config: ApiGeneratorConfig) {
    this.config = config
  }

  initialize(data: AsyncAPIReadOutput, config: GeneratorConfig, generators: AsyncAPIGenerator[]): void {
    this.context = createAsyncAPIGeneratorContext(data, config, generators)
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

  public referenceOf(input: AsyncApiObject): TypeNode | Expression {
    const { context, config } = this
    const { nameOf } = context
    const target = this.id as AsyncAPIGeneratorTarget
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

  public dependenciesOf(fromPath: string, input: AsyncApiObject): ImportDeclaration[] {
    const { context, config } = this
    const target = this.id as AsyncAPIGeneratorTarget
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
