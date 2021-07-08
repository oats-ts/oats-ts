import { SchemaObject, ReferenceObject } from 'openapi3-ts'
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
import { append } from '../append'
import { forbidFields } from '../forbidFields'

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
    path: context.accessor.uri(schema),
    append,
  })
}
