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
import { append } from '../utils/append'
import { ignore } from '../utils/ignore'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(
  combine(
    shape<SchemaObject>(
      {
        type: optional(enumeration<SchemaObject['type']>(['integer', 'number', 'string'])),
        enum: array(combine(minLength(1), items(string()))),
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
    ]),
  ),
)

export function enumSchemaObject(
  data: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    const { uriOf } = context
    return validator(data, { path: uriOf(data), append })
  })
}
