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
        type: optional(literal('array')),
        items: object(),
      },
      true,
    ),
    forbidFields([
      'discriminator',
      'allOf',
      'oneOf',
      'anyOf',
      'not',
      'properties',
      'additionalProperties',
      'required',
      'enum',
    ]),
  ),
)

export const validateArray =
  (items: SchemaValidator = validateSchema): SchemaValidator =>
  (data: SchemaObject | ReferenceObject, context: OpenAPIGeneratorContext, validated: Set<SchemaObject>): Issue[] => {
    const schema = context.accessor.dereference(data)
    if (validated.has(schema)) {
      return []
    }
    validated.add(schema)
    return [
      ...validator(schema, {
        path: context.accessor.uri(schema),
        append,
      }),
      ...items(schema.items, context, validated),
    ]
  }
