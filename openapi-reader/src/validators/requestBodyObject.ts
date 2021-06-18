import { RequestBodyObject } from 'openapi3-ts'
import { boolean, shape, object, optional, string } from '@oats-ts/validators'

export const requestBodyObject = object(
  shape<RequestBodyObject>(
    {
      description: optional(string()),
      content: object(),
      required: optional(boolean()),
    },
    true,
  ),
)
