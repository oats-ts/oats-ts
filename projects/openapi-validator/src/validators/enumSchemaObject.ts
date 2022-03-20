import { SchemaObject } from '@oats-ts/json-schema-model'
import { Issue, object, shape, combine, array, minLength } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ignore } from '../utils/ignore'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(
  combine([
    shape<SchemaObject>(
      {
        enum: array(minLength(1)),
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
  ]),
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
    return validator(data, uriOf(data), validatorConfig)
  })
}
