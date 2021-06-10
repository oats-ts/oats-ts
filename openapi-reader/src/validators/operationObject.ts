import { OperationObject } from 'openapi3-ts'
import { boolean, fields, object, optional, string, array, itemsOf } from '@oats-ts/validators'

export const operationObject = object(
  fields<OperationObject>(
    {
      tags: optional(array(itemsOf(string()))),
      summary: optional(string()),
      description: optional(string()),
      externalDocs: optional(object()),
      operationId: string(),
      parameters: optional(array(itemsOf(object()))),
      requestBody: optional(object()),
      responses: optional(object()),
      callbacks: optional(object()),
      deprecated: optional(boolean()),
      security: optional(array(itemsOf(object()))),
      servers: optional(array(itemsOf(object()))),
    },
    true,
  ),
)
