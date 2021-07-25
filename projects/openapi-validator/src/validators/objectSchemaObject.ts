import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { values, flatMap } from 'lodash'
import { Issue, object, optional, shape, combine, array, items, string, literal } from '@oats-ts/validators'
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
        required: optional(array(items(string()))),
        properties: object(),
      },
      true,
    ),
    ignore(['discriminator', 'allOf', 'oneOf', 'anyOf', 'not', 'items', 'additionalProperties', 'enum']),
  ]),
)

export const objectSchemaObject =
  (properties: OpenAPIValidatorFn<SchemaObject> = schemaObject): OpenAPIValidatorFn<SchemaObject> =>
  (data: SchemaObject, context: OpenAPIValidatorContext, config: OpenAPIValidatorConfig): Issue[] => {
    return ifNotValidated(
      context,
      data,
    )(() => {
      const { dereference, uriOf } = context
      return ordered(() =>
        validator(data, {
          path: uriOf(data),
          append,
        }),
      )(() => flatMap(values(data.properties), (schema) => properties(schema, context, config)))
    })
  }
