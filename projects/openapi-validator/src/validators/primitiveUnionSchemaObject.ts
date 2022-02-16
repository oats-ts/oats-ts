import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { Issue, object, optional, shape, combine, array, literal, minLength } from '@oats-ts/validators'
import { getInferredType } from '@oats-ts/json-schema-common'
import { append } from '../utils/append'
import { flatMap } from 'lodash'
import { enumSchemaObject } from './enumSchemaObject'
import { primitiveSchemaObject } from './primitiveSchemaObject'
import { ordered } from '../utils/ordered'
import { ignore } from '../utils/ignore'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'
import { schemaObject } from './schemaObject'

const validator = object(
  combine([
    shape<SchemaObject>(
      {
        type: optional(literal('object')),
        oneOf: array(minLength(1)),
      },
      true,
    ),
    ignore(['allOf', 'anyOf', 'not', 'items', 'properties', 'additionalProperties', 'discriminator', 'enum']),
  ]),
)
export function primitiveUnionSchemaObject(
  input: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    input,
  )(() => {
    const { uriOf } = context
    return ordered(() =>
      validator(input, {
        append,
        path: uriOf(input),
      }),
    )(() =>
      flatMap(input.oneOf, (schema: SchemaObject): Issue[] => {
        switch (getInferredType(schema)) {
          case 'ref':
            return referenceable(schemaObject)(schema as ReferenceObject, context, config)
          case 'enum':
            return enumSchemaObject(schema, context, config)
          case 'string':
          case 'number':
          case 'boolean':
            return primitiveSchemaObject(schema, context, config)
          default:
            return [
              {
                message: 'should be either a primitive type or an enum',
                path: uriOf(schema),
                severity: 'error',
                type: 'other',
              },
            ]
        }
      }),
    )
  })
}
