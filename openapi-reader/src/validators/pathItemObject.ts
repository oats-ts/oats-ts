import { PathItemObject } from 'openapi3-ts'
import { fields, object, optional, string, array } from '@oats-ts/validators'

export const pathItemObject = object(
  fields<PathItemObject>(
    {
      $ref: optional(string()),
      description: optional(string()),
      summary: optional(string()),
      delete: optional(object()),
      get: optional(object()),
      head: optional(object()),
      options: optional(object()),
      patch: optional(object()),
      post: optional(object()),
      put: optional(object()),
      trace: optional(object()),
      parameters: optional(array()),
      servers: optional(array()),
    },
    true,
  ),
)
