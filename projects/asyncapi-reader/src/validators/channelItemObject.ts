import { ChannelItemObject } from '@oats-ts/asyncapi-model'
import { shape, object, optional, string, array, items } from '@oats-ts/validators'
import { recordOfObjects } from './recordOfObjects'

export const channelItemObject = object(
  shape<ChannelItemObject>({
    name: optional(string()),
    description: optional(string()),
    parameters: optional(recordOfObjects),
    bindings: optional(object()),
    publish: optional(object()),
    subscribe: optional(object()),
  }),
)
