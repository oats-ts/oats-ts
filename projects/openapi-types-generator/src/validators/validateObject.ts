import { SchemaObject } from 'openapi3-ts'
import { values, flatMap } from 'lodash'
import { Issue, object, optional, shape, combine, array, items, string, minLength, literal } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { forbidFields } from './forbidFields'
import { append } from './utils'
import { validateSchema } from './validateSchema'

const validator = object(
  combine(
    shape<SchemaObject>(
      {
        type: optional(literal('object')),
        required: optional(array(items(string()))),
        properties: object(),
      },
      true,
    ),
    forbidFields(['discriminator', 'allOf', 'oneOf', 'anyOf', 'not', 'items', 'additionalProperties', 'enum']),
  ),
)

export function validateObject(
  input: SchemaObject,
  context: OpenAPIGeneratorContext,
  validated: Set<SchemaObject>,
): Issue[] {
  if (validated.has(input)) {
    return []
  }
  validated.add(input)
  return [
    ...validator(input, {
      path: context.accessor.uri(input),
      append,
    }),
    ...flatMap(values(input.properties), (schema) => validateSchema(schema, context, validated)),
  ]
}
