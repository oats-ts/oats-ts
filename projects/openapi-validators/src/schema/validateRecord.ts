import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue, object, optional, shape, combine, literal } from '@oats-ts/validators'
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
        additionalProperties: object(),
      },
      true,
    ),
    forbidFields(['discriminator', 'allOf', 'oneOf', 'anyOf', 'not', 'properties', 'required', 'items', 'enum']),
  ),
)

export const validateRecord =
  (additionalProperties: SchemaValidator = validateSchema): SchemaValidator =>
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
      ...additionalProperties(input.additionalProperties as SchemaObject | ReferenceObject, context, validated),
    ]
  }
