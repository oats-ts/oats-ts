import { AsyncAPIGeneratorContext, EnhancedChannel, RuntimePackages, hasPathParams } from '@oats-ts/asyncapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { ChannelsGeneratorConfig } from '../types'
import { getPathSerializerAst } from './getPathSerializerAst'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generatePathSerializer(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): TypeScriptModule {
  const { pathOf, dereference, dependenciesOf } = context
  const { channel } = data
  const { parameters } = channel
  const hasPath = hasPathParams(data.channel, context)
  if (!hasPath) {
    return undefined
  }

  const path = pathOf(data.channel, 'asyncapi/path-serializer')

  return {
    content: [getPathSerializerAst(data, context, config)],
    dependencies: [getNamedImports(RuntimePackages.Param.name, [RuntimePackages.Param.createPathSerializer])],
    path,
  }
}
