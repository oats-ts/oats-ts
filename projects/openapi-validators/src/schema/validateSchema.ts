import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue } from '@oats-ts/validators'
import { getInferredType, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { validateUnion } from './validateUnion'
import { validateEnum } from './validateEnum'
import { validatePrimitive } from './validatePrimitive'
import { validateRecord } from './validateRecord'
import { validateObject } from './validateObject'
import { validateArray } from './validateArray'

export function validateSchema(
  schema: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  validated: Set<SchemaObject>,
): Issue[] {
  const data = context.accessor.dereference(schema)
  switch (getInferredType(data)) {
    case 'array':
      return validateArray()(data, context, validated)
    case 'boolean':
    case 'string':
    case 'number':
      return validatePrimitive(data, context, validated)
    case 'enum':
      return validateEnum(data, context, validated)
    case 'object':
      return validateObject()(data, context, validated)
    case 'record':
      return validateRecord()(data, context, validated)
    case 'union':
      return validateUnion(data, context, validated)
    default:
      return []
  }
}
