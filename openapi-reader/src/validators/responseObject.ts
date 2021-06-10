import { ResponseObject } from 'openapi3-ts'
import { fields, object, optional, string } from '@oats-ts/validators'

export const responseObject = object(
  fields<ResponseObject>(
    {
      description: optional(string()),
      content: optional(object()),
      headers: optional(object()),
      links: optional(object()),
    },
    true,
  ),
)
