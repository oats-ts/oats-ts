import { Issue, object, optional, shape, combine, string, literal, boolean } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ParameterObject } from 'openapi3-ts'
import { append } from '../append'
import { validateParameterSchema } from './validateParameterSchema'
import { warnContent } from './common'

const validator = object(
  combine(
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
  ),
)

export function validateHeader(input: ParameterObject, context: OpenAPIGeneratorContext): Issue[] {
  return [
    ...validator(input, { path: context.accessor.uri(input), append }),
    ...validateParameterSchema(input.schema, context),
  ]
}
