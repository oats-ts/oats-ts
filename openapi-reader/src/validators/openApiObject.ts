import { OpenAPIObject } from 'openapi3-ts'
import { array, fields, object, optional, string } from '@oats-ts/validators'

export const openApiObject = object(
  fields<OpenAPIObject>(
    {
      openapi: string(),
      info: object(),
      servers: optional(array()),
      paths: object(),
      components: optional(object()),
      security: optional(array()),
      tags: optional(array()),
      externalDocs: optional(object()),
    },
    true,
  ),
)
