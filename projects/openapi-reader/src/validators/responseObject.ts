import { ResponseObject } from 'openapi3-ts'
import { shape, object, optional, string } from '@oats-ts/validators'

export const responseObject = object(
  shape<ResponseObject>(
    {
      description: optional(string()),
      content: optional(object()),
      headers: optional(object()),
      links: optional(object()),
    },
    true,
  ),
)