import { SchemaObject } from 'openapi3-ts'
import { Issue, object, shape, combine, array, items, minLength } from '@oats-ts/validators'
import { append } from '../utils/append'
import { flatMap } from 'lodash'
import { schemaObject } from './schemaObject'
import { ordered } from '../utils/ordered'
import { ignore } from '../utils/ignore'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from '../validators/referenceable'

const validator = object(
  combine([
    shape<SchemaObject>(
      {
        allOf: array(combine([items(object()), minLength(1)])),
      },
      true,
    ),
    ignore(['oneOf', 'anyOf', 'not', 'items', 'properties', 'additionalProperties', 'discriminator', 'enum']),
  ]),
)
export const intersectionSchemaObject =
  (alternatives: OpenAPIValidatorFn<SchemaObject> = schemaObject): OpenAPIValidatorFn<SchemaObject> =>
  (data: SchemaObject, context: OpenAPIValidatorContext, config: OpenAPIValidatorConfig): Issue[] => {
    return ifNotValidated(
      context,
      data,
    )(() => {
      const { uriOf } = context
      return ordered(() => validator(data, { append, path: uriOf(data) }))(() =>
        flatMap(data.allOf, (schema): Issue[] => referenceable(alternatives)(schema, context, config)),
      )
    })
  }
