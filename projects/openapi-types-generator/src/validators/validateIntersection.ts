import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue, object, shape, combine, array, items, minLength } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { forbidFields } from './forbidFields'
import { append } from './utils'
import { flatMap } from 'lodash'
import { validateSchema } from './validateSchema'

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
export function validatePrimitiveUnion(
  input: SchemaObject,
  context: OpenAPIGeneratorContext,
  validated: Set<SchemaObject>,
): Issue[] {
  const { accessor } = context
  if (validated.has(input)) {
    return []
  }
  validated.add(input)
  const structureIssues = validator(input, { append, path: accessor.uri(input) })
  if (structureIssues) {
    return structureIssues
  }

  return flatMap(input.allOf, (schema: SchemaObject | ReferenceObject): Issue[] => {
    return validateSchema(schema, context, validated)
  })
}
