import { AsyncAPIGeneratorContext, EnhancedChannel, hasPathParams, hasQueryParams } from '@oats-ts/asyncapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { ChannelsGeneratorConfig } from '../types'
import { getInputTypeAst } from './getInputTypeAst'

export function generateInputType(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): TypeScriptModule {
  const { pathOf, dependenciesOf } = context
  const hasPath = hasPathParams(data.channel, context)
  const hasQuery = hasQueryParams(data.channel, context)
  if (!hasPath && !hasQuery) {
    return undefined
  }
  const path = pathOf(data.channel, 'asyncapi/input-type')
  return {
    content: [getInputTypeAst(data, context, config)],
    dependencies: [
      ...dependenciesOf(path, data.channel, 'asyncapi/query-type'),
      ...dependenciesOf(path, data.channel, 'asyncapi/path-type'),
    ],
    path,
  }
}
