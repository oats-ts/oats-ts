import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue, object, optional, shape, combine, literal } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../append'
import { validateSchema } from './validateSchema'
import { SchemaValidator } from './typings'
import { ordered } from '../ordered'
import { ignore } from '../ignore'

const validator = object(
  combine(
    shape<SchemaObject>(
      {
        type: optional(literal('object')),
        additionalProperties: object(),
      },
      true,
    ),
    ignore(['discriminator', 'allOf', 'oneOf', 'anyOf', 'not', 'properties', 'required', 'items', 'enum']),
  ),
)

export const validateRecord =
  (additionalProperties: SchemaValidator = validateSchema): SchemaValidator =>
  (data: SchemaObject | ReferenceObject, context: OpenAPIGeneratorContext, validated: Set<SchemaObject>): Issue[] => {
    const { uriOf, dereference } = context
    const input = dereference(data)
    if (validated.has(input)) {
      return []
    }
    validated.add(input)
    return ordered(() =>
      validator(input, {
        path: uriOf(input),
        append,
      }),
    )(() => additionalProperties(input.additionalProperties as SchemaObject | ReferenceObject, context, validated))
  }
