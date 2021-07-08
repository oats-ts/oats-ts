import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { values, flatMap } from 'lodash'
import { Issue, object, optional, shape, combine, array, items, string, literal } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../append'
import { validateSchema } from './validateSchema'
import { forbidFields } from '../forbidFields'
import { SchemaValidator } from './typings'

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

export const validateObject =
  (properties: SchemaValidator = validateSchema): SchemaValidator =>
  (data: SchemaObject | ReferenceObject, context: OpenAPIGeneratorContext, validated: Set<SchemaObject>): Issue[] => {
    const input = context.accessor.dereference(data)
    if (validated.has(input)) {
      return []
    }
    validated.add(input)
    return [
      ...validator(input, {
        path: context.accessor.uri(input),
        append,
      }),
      ...flatMap(values(input.properties), (schema) => properties(schema, context, validated)),
    ]
  }
