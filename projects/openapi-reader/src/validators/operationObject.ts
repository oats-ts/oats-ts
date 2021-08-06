import { OperationObject } from '@oats-ts/openapi-model'
import { boolean, shape, object, optional, string, array, items } from '@oats-ts/validators'

export const operationObject = object(
  shape<OperationObject>(
    {
      tags: optional(array(items(string()))),
      summary: optional(string()),
      description: optional(string()),
      externalDocs: optional(object()),
      operationId: string(),
      parameters: optional(array(items(object()))),
      requestBody: optional(object()),
      responses: optional(object()),
      callbacks: optional(object()),
      deprecated: optional(boolean()),
      security: optional(array(items(object()))),
      servers: optional(array(items(object()))),
    },
    true,
  ),
)
