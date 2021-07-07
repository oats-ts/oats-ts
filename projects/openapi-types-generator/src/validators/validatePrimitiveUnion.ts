import { SchemaObject } from 'openapi3-ts'
import { Issue, object, optional, shape, combine, array, items, literal, minLength } from '@oats-ts/validators'
import { getInferredType, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { forbidFields } from './forbidFields'
import { append } from './utils'
import { flatMap } from 'lodash'
import { validateEnum } from './validateEnum'
import { validatePrimitive } from './validatePrimitive'

const validator = object(
  combine(
    shape<SchemaObject>(
      {
        type: optional(literal('object')),
        oneOf: array(combine(items(object(forbidFields(['$ref']))), minLength(1))),
      },
      true,
    ),
    forbidFields(['allOf', 'anyOf', 'not', 'items', 'properties', 'additionalProperties', 'discriminator', 'enum']),
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

  return flatMap(input.oneOf, (schema: SchemaObject): Issue[] => {
    switch (getInferredType(schema)) {
      case 'enum':
        return validateEnum(schema, context, validated)
      case 'string':
      case 'number':
      case 'boolean':
        return validatePrimitive(schema, context, validated)
      default:
        return [
          {
            message: 'should be either a primitive type or an enum',
            path: accessor.uri(schema),
            severity: 'error',
            type: 'other',
          },
        ]
    }
  })
}
