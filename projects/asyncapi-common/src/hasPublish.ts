import { ChannelItemObject } from '@oats-ts/asyncapi-model'
import { isNil } from 'lodash'

export function hasPublish(channel: ChannelItemObject): boolean {
  return !isNil(channel.publish) && !isNil(channel.publish.message) && !isNil(channel.publish.message.payload)
}
