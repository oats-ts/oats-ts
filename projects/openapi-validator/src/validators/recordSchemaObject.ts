import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'
import { Issue, object, optional, shape, combine, literal } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { schemaObject } from './schemaObject'
import { ordered } from '../utils/ordered'
import { ignore } from '../utils/ignore'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'

const validator = object(
  combine([
    shape<SchemaObject>(
      {
        type: optional(literal('object')),
        additionalProperties: object(),
      },
      true,
    ),
    ignore(['discriminator', 'allOf', 'oneOf', 'anyOf', 'not', 'properties', 'required', 'items', 'enum']),
  ]),
)

export const recordSchemaObject =
  (additionalProperties: OpenAPIValidatorFn<SchemaObject> = schemaObject): OpenAPIValidatorFn<SchemaObject> =>
  (data: SchemaObject, context: OpenAPIValidatorContext, config: OpenAPIValidatorConfig): Issue[] => {
    return ifNotValidated(
      context,
      data,
    )(() => {
      const { uriOf } = context
      return ordered(() => validator(data, uriOf(data), validatorConfig))(() =>
        referenceable(additionalProperties)(
          data.additionalProperties as SchemaObject | ReferenceObject,
          context,
          config,
        ),
      )
    })
  }
