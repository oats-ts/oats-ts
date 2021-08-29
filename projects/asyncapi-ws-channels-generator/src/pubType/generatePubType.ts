import { AsyncAPIGeneratorContext, EnhancedChannel, hasPublish } from '@oats-ts/asyncapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { ChannelsGeneratorConfig } from '../types'
import { factory, SyntaxKind } from 'typescript'
import { documentNode } from '@oats-ts/typescript-common'

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
  const message = channel.publish.message
  const schema = message.payload
  const type = factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(data.channel, 'asyncapi/publish-type'),
    [],
    referenceOf(schema, 'asyncapi/type'),
  )
  const content = [config.documentation ? documentNode(type, message) : type]

  return {
    content,
    dependencies: dependenciesOf(path, schema, 'asyncapi/type'),
    path,
  }
}
