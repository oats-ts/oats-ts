import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue, object, optional, shape, combine, literal } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../utils/append'
import { validateSchema } from './schemaObject'
import { ordered } from '../utils/ordered'
import { ignore } from '../utils/ignore'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(
  combine(
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
  ),
)

export const arraySchemaObject =
  (items: OpenAPIValidatorFn<SchemaObject> = validateSchema): OpenAPIValidatorFn<SchemaObject> =>
  (data: SchemaObject, context: OpenAPIValidatorContext, config: OpenAPIValidatorConfig): Issue[] => {
    return ifNotValidated(
      context,
      data,
    )(() => {
      const { uriOf, dereference } = context
      const schema = dereference(data)
      return ordered(() =>
        validator(schema, {
          path: uriOf(schema),
          append,
        }),
      )(() => items(schema.items, context, config))
    })
  }
