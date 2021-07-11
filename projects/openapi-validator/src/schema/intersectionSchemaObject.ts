import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue, object, shape, combine, array, items, minLength } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../utils/append'
import { flatMap } from 'lodash'
import { validateSchema } from './schemaObject'
import { ordered } from '../utils/ordered'
import { ignore } from '../utils/ignore'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(
  combine(
    shape<SchemaObject>(
      {
        allOf: array(combine(items(object()), minLength(1))),
      },
      true,
    ),
    ignore(['oneOf', 'anyOf', 'not', 'items', 'properties', 'additionalProperties', 'discriminator', 'enum']),
  ),
)
export const intersectionSchemaObject =
  (alternatives: OpenAPIValidatorFn<SchemaObject> = validateSchema): OpenAPIValidatorFn<SchemaObject> =>
  (data: SchemaObject, context: OpenAPIValidatorContext, config: OpenAPIValidatorConfig): Issue[] => {
    return ifNotValidated(
      context,
      data,
    )(() => {
      const { dereference, uriOf } = context
      const input = dereference(data)
      return ordered(() =>
        validator(input, {
          append,
          path: uriOf(input),
        }),
      )(() =>
        flatMap(input.allOf, (schema: SchemaObject | ReferenceObject): Issue[] => {
          return alternatives(schema, context, config)
        }),
      )
    })
  }
