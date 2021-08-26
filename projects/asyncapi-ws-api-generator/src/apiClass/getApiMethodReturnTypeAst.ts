import { factory, TypeReferenceNode } from 'typescript'
import { EnhancedChannel } from '@oats-ts/asyncapi-common'
import { AsyncAPIGeneratorContext } from '@oats-ts/asyncapi-common'

export function getApiMethodReturnTypeAst(data: EnhancedChannel, context: AsyncAPIGeneratorContext): TypeReferenceNode {
  const { nameOf } = context
  return factory.createTypeReferenceNode(nameOf(data.channel, 'asyncapi/channel'))
}
