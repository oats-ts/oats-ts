import { ChannelItemObject } from '@oats-ts/asyncapi-model'
import { isNil } from 'lodash'

export function hasSubscribe(channel: ChannelItemObject): boolean {
  return !isNil(channel.subscribe) && !isNil(channel.subscribe.message) && !isNil(channel.subscribe.message.payload)
}
