import { RequestBodyObject } from 'openapi3-ts'
import { boolean, fields, object, optional, string } from '@oats-ts/validators'

export const requestBodyObject = object(
  fields<RequestBodyObject>(
    {
      description: optional(string()),
      content: object(),
      required: optional(boolean()),
    },
    true,
  ),
)
