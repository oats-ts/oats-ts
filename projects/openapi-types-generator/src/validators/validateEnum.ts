import { SchemaObject } from 'openapi3-ts'
import {
  enumeration,
  Issue,
  object,
  optional,
  shape,
  combine,
  array,
  items,
  string,
  minLength,
} from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { forbidFields } from './forbidFields'
import { append } from './utils'

const validator = object(
  combine(
    shape<SchemaObject>(
      {
        type: optional(enumeration<SchemaObject['type']>(['integer', 'number', 'string'])),
        enum: array(combine(minLength(1), items(string()))),
      },
      true,
    ),
    forbidFields([
      'discriminator',
      'allOf',
      'oneOf',
      'anyOf',
      'not',
      'items',
      'properties',
      'additionalProperties',
      'required',
    ]),
  ),
)

export function validateEnum(
  input: SchemaObject,
  context: OpenAPIGeneratorContext,
  validated: Set<SchemaObject>,
): Issue[] {
  if (validated.has(input)) {
    return []
  }
  validated.add(input)
  return validator(input, {
    path: context.accessor.uri(input),
    append,
  })
}
