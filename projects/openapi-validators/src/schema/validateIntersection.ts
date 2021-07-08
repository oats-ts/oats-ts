import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue, object, shape, combine, array, items, minLength } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../append'
import { flatMap } from 'lodash'
import { validateSchema } from './validateSchema'
import { forbidFields } from '../forbidFields'
import { SchemaValidator } from './typings'

const validator = object(
  combine(
    shape<SchemaObject>(
      {
        allOf: array(combine(items(object()), minLength(1))),
      },
      true,
    ),
    forbidFields(['oneOf', 'anyOf', 'not', 'items', 'properties', 'additionalProperties', 'discriminator', 'enum']),
  ),
)
export const validatePrimitiveUnion =
  (alternatives: SchemaValidator = validateSchema): SchemaValidator =>
  (data: SchemaObject | ReferenceObject, context: OpenAPIGeneratorContext, validated: Set<SchemaObject>): Issue[] => {
    const { accessor } = context
    const input = accessor.dereference(data)
    if (validated.has(input)) {
      return []
    }
    validated.add(input)
    const structureIssues = validator(input, { append, path: accessor.uri(input) })
    if (structureIssues) {
      return structureIssues
    }

    return flatMap(input.allOf, (schema: SchemaObject | ReferenceObject): Issue[] => {
      return alternatives(schema, context, validated)
    })
  }
