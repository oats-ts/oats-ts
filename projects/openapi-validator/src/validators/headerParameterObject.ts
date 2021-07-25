import { Issue, object, optional, shape, combine, string, literal, boolean } from '@oats-ts/validators'
import { ParameterObject } from 'openapi3-ts'
import { append } from '../utils/append'
import { parameterObjectSchema } from './parameterObjectSchema'
import { warnContent } from '../utils/warnContent'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'

const validator = object(
  combine([
    shape<ParameterObject>(
      {
        name: string(),
        in: literal('header'),
        required: optional(boolean()),
        style: optional(literal('simple')),
        schema: object(),
      },
      true,
    ),
    warnContent,
  ]),
)

export function headerParameterObject(
  input: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  const { uriOf } = context
  return ordered(() => validator(input, { path: uriOf(input), append }))(() =>
    parameterObjectSchema(input.schema, context, config),
  )
}
