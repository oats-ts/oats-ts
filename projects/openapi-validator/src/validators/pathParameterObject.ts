import { Issue, object, optional, shape, combine, string, literal, enumeration } from '@oats-ts/validators'
import { ParameterObject } from 'openapi3-ts'
import { append } from '../utils/append'
import { parameterObjectSchema } from './parameterObjectSchema'
import { warnContent } from '../utils/warnContent'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'

const validator = object(
  combine(
    shape<ParameterObject>(
      {
        name: string(),
        in: literal('path'),
        required: literal(true),
        style: optional(enumeration(['simple', 'label', 'matrix'])),
        schema: object(),
      },
      true,
    ),
    warnContent,
  ),
)

export function pathParameterObject(
  data: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  const { uriOf } = context
  return ordered(() => validator(data, { path: uriOf(data), append }))(() =>
    parameterObjectSchema(data.schema, context, config),
  )
}
