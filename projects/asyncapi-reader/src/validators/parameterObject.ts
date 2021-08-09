import { ParameterObject } from '@oats-ts/asyncapi-model'
import { shape, object, optional, string } from '@oats-ts/validators'

export const parameterObject = object(
  shape<ParameterObject>({
    description: optional(string()),
    schema: optional(object()),
    location: optional(string()),
  }),
)
