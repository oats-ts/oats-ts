import { AsyncAPIGeneratorContext, EnhancedChannel, hasSubscribe } from '@oats-ts/asyncapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { ChannelsGeneratorConfig } from '../types'
import { factory, SyntaxKind } from 'typescript'
import { documentNode } from '@oats-ts/typescript-common'

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
  const message = channel.subscribe.message
  const schema = message.payload

  const type = factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(data.channel, 'asyncapi/subscribe-type'),
    [],
    referenceOf(schema, 'json-schema/type'),
  )

  const content = [config.documentation ? documentNode(type, message) : type]

  return {
    content,
    dependencies: dependenciesOf(path, schema, 'json-schema/type'),
    path,
  }
}
