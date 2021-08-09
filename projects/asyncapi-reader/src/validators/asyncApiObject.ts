import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { array, shape, object, optional, string, items } from '@oats-ts/validators'

export const asyncApiObject = object(
  shape<AsyncApiObject>({
    id: optional(string()),
    asyncapi: string(),
    info: object(),
    servers: optional(array(items(object()))),
    components: optional(object()),
    channels: optional(object()),
    tags: optional(array(items(object()))),
    externalDocs: optional(object()),
  }),
)
