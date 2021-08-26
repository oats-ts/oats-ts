import { MessageObject, MessageTraitObject } from '@oats-ts/asyncapi-model'
import { shape, object, optional, string, array, items, ShapeInput } from '@oats-ts/validators'

const messageTraitsShape: ShapeInput<MessageTraitObject> = {
  bindings: optional(object()),
  contentType: optional(string()),
  schemaFormat: optional(string()),
  correlationId: optional(object()),
  description: optional(string()),
  examples: optional(object()),
  externalDocs: optional(object()),
  headers: optional(object()),
  name: optional(string()),
  summary: optional(object()),
  tags: optional(array(items(object()))),
  title: optional(string()),
}

export const messageTraitObject = object(shape<MessageTraitObject>(messageTraitsShape))

export const messageObject = object(
  shape<MessageObject>({
    ...messageTraitsShape,
    payload: object(),
    traits: optional(array()),
  }),
)
