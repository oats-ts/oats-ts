import { AsyncAPIGeneratorContext, EnhancedChannel } from '@oats-ts/asyncapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { ChannelsGeneratorConfig } from '../types'
import { factory, SyntaxKind } from 'typescript'
import { hasPublish } from '../channel/hasPublish'

export function generatePubType(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): TypeScriptModule {
  const { nameOf, pathOf, dependenciesOf, referenceOf } = context
  const { channel } = data
  const hasPub = hasPublish(data.channel)
  if (!hasPub) {
    return undefined
  }

  const path = pathOf(data.channel, 'asyncapi/publish-type')
  const schema = channel.publish.message.payload

  const content = [
    factory.createTypeAliasDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      nameOf(data.channel, 'asyncapi/publish-type'),
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
