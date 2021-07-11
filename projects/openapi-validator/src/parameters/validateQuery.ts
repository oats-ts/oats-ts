import { Issue, object, optional, shape, combine, string, literal, boolean, enumeration } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ParameterObject } from 'openapi3-ts'
import { append } from '../append'
import { validateArraySchema, validateObjectSchema, validateParameterSchema } from './validateParameterSchema'
import { warnContent } from './common'
import { ordered } from '../ordered'

const validator = object(
  combine(
    shape<ParameterObject>(
      {
        name: string(),
        in: literal('query'),
        required: optional(boolean()),
        style: optional(enumeration(['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'])),
        schema: object(),
      },
      true,
    ),
    warnContent,
  ),
)

export function validateQuery(input: ParameterObject, context: OpenAPIGeneratorContext): Issue[] {
  const { uriOf } = context
  const uri = uriOf(input)
  return ordered(() =>
    validator(input, {
      path: uri,
      append,
    }),
  )(() => {
    switch (input.style) {
      case 'form': {
        return validateParameterSchema(input.schema, context)
      }
      case 'spaceDelimited': {
        return [
          ...literal(true)(input.explode, { path: append(uri, 'explode'), append }),
          ...validateArraySchema(input.schema, context, new Set()),
        ]
      }
      case 'pipeDelimited': {
        return [
          ...literal(true)(input.explode, { path: append(uri, 'explode'), append }),
          ...validateArraySchema(input.schema, context, new Set()),
        ]
      }
      case 'deepObject': {
        return [
          ...literal(true)(input.explode, { path: append(uri, 'explode'), append }),
          ...validateObjectSchema(input.schema, context, new Set()),
        ]
      }
    }
    return []
  })
}
