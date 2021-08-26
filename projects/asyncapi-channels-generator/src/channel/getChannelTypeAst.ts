import {
  AsyncAPIGeneratorContext,
  EnhancedChannel,
  RuntimePackages,
  hasPublish,
  hasSubscribe,
} from '@oats-ts/asyncapi-common'
import { ChannelsGeneratorConfig } from '../types'
import { factory, SyntaxKind, TypeAliasDeclaration, TypeNode } from 'typescript'

export function getBaseType(data: EnhancedChannel, context: AsyncAPIGeneratorContext): TypeNode {
  const { channel } = data
  const { referenceOf } = context
  const hasPub = hasPublish(channel)
  const hasSub = hasSubscribe(channel)
  if (hasPub && !hasSub) {
    return factory.createTypeReferenceNode(RuntimePackages.Ws.PubSocket, [
      referenceOf(channel, 'asyncapi/publish-type'),
    ])
  } else if (hasSub && !hasPub) {
    return factory.createTypeReferenceNode(RuntimePackages.Ws.SubSocket, [
      referenceOf(channel, 'asyncapi/subscribe-type'),
    ])
  } else if (hasPub && hasSub) {
    return factory.createTypeReferenceNode(RuntimePackages.Ws.PubSubSocket, [
      referenceOf(channel, 'asyncapi/publish-type'),
      referenceOf(channel, 'asyncapi/subscribe-type'),
    ])
  }
}

export function getChannelTypeAst(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): TypeAliasDeclaration {
  const { nameOf } = context
  const type = getBaseType(data, context)
  return factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(data.channel, 'asyncapi/channel'),
    undefined,
    type,
  )
}
