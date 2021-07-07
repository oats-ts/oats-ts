import { SchemaObject } from 'openapi3-ts'
import { Issue } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from './utils'
import { forbidFields } from './forbidFields'

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
      append,
      path: context.accessor.uri(input),
    }),
  ]
}
