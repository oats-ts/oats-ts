import { WebSocketsChannelBinding } from '@oats-ts/asyncapi-model'
import { shape, object, optional, string } from '@oats-ts/validators'

export const webSocketsChannelBinding = object(
  shape<WebSocketsChannelBinding>({
    bindingVersion: optional(string()),
    headers: optional(object()),
    query: optional(object()),
  }),
)
