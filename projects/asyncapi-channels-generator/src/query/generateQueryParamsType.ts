import { AsyncAPIGeneratorContext, EnhancedChannel } from '@oats-ts/asyncapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { ChannelsGeneratorConfig } from '../types'
import { factory, SyntaxKind } from 'typescript'
import { hasQueryParams } from '../factory/hasQueryParams'

export function generateQueryParamsType(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): TypeScriptModule {
  const { nameOf, pathOf, dependenciesOf, referenceOf } = context
  const { channel } = data
  const hasQuery = hasQueryParams(data.channel, context)
  if (!hasQuery) {
    return undefined
  }

  const path = pathOf(data.channel, 'asyncapi/query-type')
  const schema = channel.bindings.ws.query

  const content = [
    factory.createTypeAliasDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      nameOf(data.channel, 'asyncapi/query-type'),
      [],
      referenceOf(schema, 'asyncapi/type'),
    ),
  ]

  return {
    content,
    dependencies: dependenciesOf(path, schema, 'asyncapi/type'),
    path,
  }
}
