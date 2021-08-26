import { AsyncAPIGeneratorContext, EnhancedChannel } from '@oats-ts/asyncapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { ChannelsGeneratorConfig } from '../types'
import { factory, SyntaxKind } from 'typescript'
import { hasSubscribe } from '../channel/hasSubscribe'

export function generateSubType(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): TypeScriptModule {
  const { nameOf, pathOf, dependenciesOf, referenceOf } = context
  const { channel } = data
  const hasSub = hasSubscribe(data.channel)
  if (!hasSub) {
    return undefined
  }

  const path = pathOf(data.channel, 'asyncapi/subscribe-type')
  const schema = channel.subscribe.message.payload

  const content = [
    factory.createTypeAliasDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      nameOf(data.channel, 'asyncapi/subscribe-type'),
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
