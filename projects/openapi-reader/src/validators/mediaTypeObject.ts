import { MediaTypeObject } from '@oats-ts/openapi-model'
import { shape, object, optional } from '@oats-ts/validators'

export const mediaTypeObject = object(
  shape<MediaTypeObject>(
    {
      schema: optional(object()),
      examples: optional(object()),
      example: optional(object()),
      encoding: optional(object()),
    },
    true,
  ),
)
