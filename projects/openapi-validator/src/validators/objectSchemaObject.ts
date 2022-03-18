import { SchemaObject } from '@oats-ts/json-schema-model'
import { values, flatMap } from 'lodash'
import { Issue, object, optional, shape, combine, array, items, string, literal } from '@oats-ts/validators'
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
      const { uriOf } = context
      return ordered(() => validator(data, uriOf(data), { append }))(() =>
        flatMap(values(data.properties), (schema) => referenceable(properties)(schema, context, config)),
      )
    })
  }
