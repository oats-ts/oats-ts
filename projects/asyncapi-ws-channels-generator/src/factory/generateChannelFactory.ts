import {
  AsyncAPIGeneratorContext,
  EnhancedChannel,
  RuntimePackages,
  hasPathParams,
  hasQueryParams,
} from '@oats-ts/asyncapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getChannelFactoryAst } from './getChannelFactoryAst'
import { ChannelsGeneratorConfig } from '../types'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateChannelFactory(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): TypeScriptModule {
  const { pathOf, dependenciesOf } = context
  const hasPath = hasPathParams(data.channel, context)
  const hasQuery = hasQueryParams(data.channel, context)
  const hasInput = hasPath || hasQuery
  const path = pathOf(data.channel, 'asyncapi/channel-factory')
  return {
    content: [getChannelFactoryAst(data, context, config)],
    dependencies: [
      getNamedImports(RuntimePackages.Ws.name, [RuntimePackages.Ws.WebsocketConfig]),
      getNamedImports(RuntimePackages.Param.name, [
        ...(hasInput ? [RuntimePackages.Param.joinUrl] : []),
        ...(hasQuery ? [RuntimePackages.Param.serializeQuery] : []),
      ]),
      ...dependenciesOf(path, data.channel, 'asyncapi/channel'),
      ...dependenciesOf(path, data.channel, 'asyncapi/input-type'),
      ...dependenciesOf(path, data.channel, 'asyncapi/path-serializer'),
    ],
    path,
  }
}
