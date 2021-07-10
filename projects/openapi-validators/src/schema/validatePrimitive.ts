import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { combine, enumeration, Issue, object, shape } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../append'
import { ignore } from '../ignore'

const validator = object(
  combine(
    shape(
      {
        type: enumeration(['string', 'boolean', 'number', 'integer']),
      },
      true,
    ),
    ignore([
      'discriminator',
      'allOf',
      'oneOf',
      'anyOf',
      'not',
      'items',
      'properties',
      'additionalProperties',
      'required',
      'enum',
    ]),
  ),
)

export function validatePrimitive(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  validated: Set<SchemaObject>,
): Issue[] {
  const schema = context.accessor.dereference(data)
  if (validated.has(schema)) {
    return []
  }
  validated.add(schema)
  return validator(schema, {
    append,
    path: context.accessor.uri(schema),
  })
}
