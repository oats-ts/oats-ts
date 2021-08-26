import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { AsyncAPIGeneratorContext, EnhancedChannel } from './typings'
import { entries } from 'lodash'

export function getEnhancedChannels(doc: AsyncApiObject, context: AsyncAPIGeneratorContext): EnhancedChannel[] {
  const { dereference } = context
  return entries(doc.channels).map(([topic, channel]): EnhancedChannel => {
    return {
      channel: dereference(channel, true),
      url: topic,
    }
  })
}
