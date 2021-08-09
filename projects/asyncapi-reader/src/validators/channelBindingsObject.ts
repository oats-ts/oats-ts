import { ChannelBindingsObject } from '@oats-ts/asyncapi-model'
import { shape, object, optional } from '@oats-ts/validators'

export const channelBindingsObject = object(
  shape<ChannelBindingsObject>({
    amqp1: optional(object()),
    amqp: optional(object()),
    http: optional(object()),
    jms: optional(object()),
    kafka: optional(object()),
    mqtt5: optional(object()),
    mqtt: optional(object()),
    nats: optional(object()),
    redis: optional(object()),
    sns: optional(object()),
    sqs: optional(object()),
    stomp: optional(object()),
    ws: optional(object()),
  }),
)
