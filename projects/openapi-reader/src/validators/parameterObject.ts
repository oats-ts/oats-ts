import { BaseParameterObject, HeaderObject, ParameterObject } from '@oats-ts/openapi-model'
import { boolean, shape, object, optional, string, enumeration, any, Validator } from '@oats-ts/validators'

const baseParameterObjectFileds: Record<keyof BaseParameterObject, Validator<any>> = {
  description: optional(string()),
  required: optional(boolean()),
  deprecated: optional(boolean()),
  allowEmptyValue: optional(boolean()),
  style: optional(enumeration(['matrix', 'label', 'form', 'simple', 'spaceDelimited', 'pipeDelimited', 'deepObject'])),
  explode: optional(boolean()),
  allowReserved: optional(boolean()),
  schema: optional(object()),
  examples: optional(object()),
  example: optional(any()),
  content: optional(object()),
}

export const headerObject = object(shape<HeaderObject>(baseParameterObjectFileds))

export const parameterObject = object(
  shape<ParameterObject>({
    ...baseParameterObjectFileds,
    name: string(),
    in: enumeration(['query', 'header', 'path', 'cookie']),
  }),
)
