import { HeaderObject, ParameterObject } from 'openapi3-ts'
import { boolean, fields, object, optional, string, enumeration, any } from '@oats-ts/validators'

const baseParameterObjectFileds = {
  description: optional(string()),
  required: optional(boolean()),
  deprecated: optional(boolean()),
  allowEmptyValue: optional(boolean()),
  style: optional(enumeration(['matrix', 'label', 'form', 'simple', 'spaceDelimited', 'pipeDelimited', 'deepObject'])),
  explode: optional(boolean()),
  allowReserved: optional(boolean()),
  schema: optional(object()),
  examples: optional(object()),
  example: optional(any),
  content: optional(object()),
}

export const headerObject = object(fields<HeaderObject>(baseParameterObjectFileds))

export const parameterObject = object(
  fields<ParameterObject>({
    ...baseParameterObjectFileds,
    name: string(),
    in: enumeration(['query', 'header', 'path', 'cookie']),
  }),
)
