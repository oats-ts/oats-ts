import { Issue, object, optional, shape, combine, string, literal, enumeration } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ParameterObject } from 'openapi3-ts'
import { append } from '../append'
import { validateParameterSchema } from './validateParameterSchema'
import { warnContent } from './common'
import { ordered } from '../ordered'

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

export function validatePath(input: ParameterObject, context: OpenAPIGeneratorContext): Issue[] {
  return ordered(() =>
    validator(input, {
      path: context.accessor.uri(input),
      append,
    }),
  )(() => validateParameterSchema(input.schema, context))
}
