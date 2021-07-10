import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue, object, shape, combine, array, items, minLength } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../append'
import { flatMap } from 'lodash'
import { validateSchema } from './validateSchema'
import { SchemaValidator } from './typings'
import { ordered } from '../ordered'
import { ignore } from '../ignore'

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
export const validatePrimitiveUnion =
  (alternatives: SchemaValidator = validateSchema): SchemaValidator =>
  (data: SchemaObject | ReferenceObject, context: OpenAPIGeneratorContext, validated: Set<SchemaObject>): Issue[] => {
    const { dereference, uriOf } = context
    const input = dereference(data)
    if (validated.has(input)) {
      return []
    }
    validated.add(input)
    return ordered(() =>
      validator(input, {
        append,
        path: uriOf(input),
      }),
    )(() =>
      flatMap(input.allOf, (schema: SchemaObject | ReferenceObject): Issue[] => {
        return alternatives(schema, context, validated)
      }),
    )
  }
