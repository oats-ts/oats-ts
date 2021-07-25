import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue, object, optional, shape, combine, literal } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../utils/append'
import { schemaObject } from './schemaObject'
import { ordered } from '../utils/ordered'
import { ignore } from '../utils/ignore'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

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
      return ordered(() =>
        validator(data, {
          path: uriOf(data),
          append,
        }),
      )(() => additionalProperties(data.additionalProperties as SchemaObject | ReferenceObject, context, config))
    })
  }
