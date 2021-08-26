import { AsyncAPIGeneratorContext, EnhancedChannel, RuntimePackages } from '@oats-ts/asyncapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { ChannelsGeneratorConfig } from '../types'
import { getChannelTypeAst } from './getChannelTypeAst'
import { ImportDeclaration } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'
import { hasPublish } from './hasPublish'
import { hasSubscribe } from './hasSubscribe'

export function getBaseTypeImport(data: EnhancedChannel): ImportDeclaration {
  const { channel } = data
  const hasPub = hasPublish(channel)
  const hasSub = hasSubscribe(channel)
  if (hasPub && !hasSub) {
    return getNamedImports(RuntimePackages.Ws.name, [RuntimePackages.Ws.PubSocket])
  } else if (hasSub && !hasPub) {
    return getNamedImports(RuntimePackages.Ws.name, [RuntimePackages.Ws.SubSocket])
  } else if (hasSub && hasPub) {
    return getNamedImports(RuntimePackages.Ws.name, [RuntimePackages.Ws.PubSubSocket])
  }
}

export function generateChannelType(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): TypeScriptModule {
  const { pathOf, dependenciesOf } = context
  const path = pathOf(data.channel, 'asyncapi/channel')
  return {
    content: [getChannelTypeAst(data, context, config)],
    dependencies: [
      getBaseTypeImport(data),
      ...dependenciesOf(path, data.channel, 'asyncapi/subscribe-type'),
      ...dependenciesOf(path, data.channel, 'asyncapi/publish-type'),
    ],
    path,
  }
}
