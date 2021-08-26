import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { AsyncAPIReadOutput } from '@oats-ts/asyncapi-reader'
import { isNil, sortBy, flatMap, negate } from 'lodash'
import { AsyncAPIGeneratorTarget } from '@oats-ts/asyncapi'
import {
  AsyncAPIGenerator,
  AsyncAPIGeneratorContext,
  createAsyncAPIGeneratorContext,
  getEnhancedChannels,
} from '@oats-ts/asyncapi-common'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { ImportDeclaration, Identifier, factory } from 'typescript'
import { ChannelsGeneratorConfig } from './types'
import { generateChannelFactory } from './factory/generateChannelFactory'
import { generateChannelType } from './channel/generateChannelType'
import { hasPathParams } from './factory/hasPathParams'
import { getModelImports } from '@oats-ts/typescript-common'
import { generateInputType } from './input/generateInputType'
import { hasQueryParams } from './factory/hasQueryParams'
import { generatePathParamsType } from './path/generatePathParamsType'
import { generateQueryParamsType } from './query/generateQueryParamsType'
import { ChannelItemObject } from '@oats-ts/asyncapi-model'
import { hasSubscribe } from './channel/hasSubscribe'
import { hasPublish } from './channel/hasPublish'
import { generateSubType } from './subType/generateSubType'
import { generatePubType } from './pubType/generatePubType'
import { generatePathSerializer } from './pathSerializer/generatePathSerializer'

export class ChannelsGenerator implements AsyncAPIGenerator {
  public static id = 'asyncapi/channels'
  private static consumes: AsyncAPIGeneratorTarget[] = ['asyncapi/type']
  private static produces: AsyncAPIGeneratorTarget[] = ['asyncapi/channel']

  private context: AsyncAPIGeneratorContext = null
  private config: GeneratorConfig & ChannelsGeneratorConfig

  public readonly id: string = ChannelsGenerator.id
  public readonly produces: string[] = ChannelsGenerator.produces
  public readonly consumes: string[] = ChannelsGenerator.consumes

  constructor(config: GeneratorConfig) {
    this.config = config
  }

  initialize(data: AsyncAPIReadOutput, generators: AsyncAPIGenerator[]): void {
    this.context = createAsyncAPIGeneratorContext(data, this.config, generators)
  }

  async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const { nameOf } = context
    const channels = sortBy(getEnhancedChannels(context.document, context), ({ channel }) =>
      nameOf(channel, 'asyncapi/channel-factory'),
    )
    const data = mergeTypeScriptModules(
      flatMap(channels, (channel) => {
        return [
          generatePathParamsType(channel, context, config),
          generateQueryParamsType(channel, context, config),
          generateInputType(channel, context, config),
          generateSubType(channel, context, config),
          generatePubType(channel, context, config),
          generatePathSerializer(channel, context, config),
          generateChannelType(channel, context, config),
          generateChannelFactory(channel, context, config),
        ].filter(negate(isNil))
      }),
    )
    return {
      isOk: true,
      issues: [],
      data,
    }
  }

  referenceOf(input: any, target: AsyncAPIGeneratorTarget): Identifier {
    const { nameOf } = this.context
    switch (target) {
      case 'asyncapi/channel-factory':
      case 'asyncapi/channel':
      case 'asyncapi/publish-type':
      case 'asyncapi/subscribe-type': {
        const name = nameOf(input, target)
        return isNil(name) ? undefined : factory.createIdentifier(name)
      }
      case 'asyncapi/input-type': {
        const hasPath = hasPathParams(input, this.context)
        const hasQuery = hasQueryParams(input, this.context)
        const name = nameOf(input, target)
        return isNil(name) || (!hasPath && !hasQuery) ? undefined : factory.createIdentifier(name)
      }
      case 'asyncapi/query-type': {
        const name = nameOf(input, target)
        return isNil(name) || !hasQueryParams(input, this.context) ? undefined : factory.createIdentifier(name)
      }
      case 'asyncapi/path-type':
      case 'asyncapi/path-serializer': {
        const name = nameOf(input, target)
        return isNil(name) || !hasPathParams(input, this.context) ? undefined : factory.createIdentifier(name)
      }
      default:
        return undefined
    }
  }

  dependenciesOf(fromPath: string, input: ChannelItemObject, target: AsyncAPIGeneratorTarget): ImportDeclaration[] {
    switch (target) {
      case 'asyncapi/channel-factory':
      case 'asyncapi/channel':
        return getModelImports(fromPath, target, [input], this.context)
      case 'asyncapi/input-type': {
        const hasPath = hasPathParams(input, this.context)
        const hasQuery = hasQueryParams(input, this.context)
        return hasPath || hasQuery ? getModelImports(fromPath, target, [input], this.context) : []
      }
      case 'asyncapi/path-type':
      case 'asyncapi/path-serializer': {
        const hasPath = hasPathParams(input, this.context)
        return hasPath ? getModelImports(fromPath, target, [input], this.context) : []
      }
      case 'asyncapi/query-type': {
        const hasQuery = hasQueryParams(input, this.context)
        return hasQuery ? getModelImports(fromPath, target, [input], this.context) : []
      }
      case 'asyncapi/subscribe-type': {
        const hasSub = hasSubscribe(input)
        return hasSub ? getModelImports(fromPath, target, [input], this.context) : []
      }
      case 'asyncapi/publish-type': {
        const hasPub = hasPublish(input)
        return hasPub ? getModelImports(fromPath, target, [input], this.context) : []
      }
      default:
        return []
    }
  }
}
