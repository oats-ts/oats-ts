import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../append'
import { forbidFields } from '../forbidFields'

const validator = forbidFields([
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
])

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
  return [
    ...validator(schema, {
      append,
      path: context.accessor.uri(schema),
    }),
  ]
}
