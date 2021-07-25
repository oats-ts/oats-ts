import { SchemaObject } from 'openapi3-ts'
import { Issue, object, optional, shape, combine, literal } from '@oats-ts/validators'
import { append } from '../utils/append'
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
        type: optional(literal('array')),
        items: object(),
      },
      true,
    ),
    ignore([
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
  ]),
)

export const arraySchemaObject =
  (items: OpenAPIValidatorFn<SchemaObject> = schemaObject): OpenAPIValidatorFn<SchemaObject> =>
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
      )(() => referenceable(items)(data.items, context, config))
    })
  }
