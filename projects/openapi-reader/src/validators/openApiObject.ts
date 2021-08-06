import { OpenAPIObject } from '@oats-ts/openapi-model'
import { array, shape, object, optional, string, items } from '@oats-ts/validators'

export const openApiObject = object(
  shape<OpenAPIObject>(
    {
      openapi: string(),
      info: object(),
      servers: optional(array(items(object()))),
      paths: object(),
      components: optional(object()),
      security: optional(array(items(object()))),
      tags: optional(array(items(object()))),
      externalDocs: optional(object()),
    },
    true,
  ),
)
