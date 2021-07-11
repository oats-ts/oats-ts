import { SchemaValidator } from '../schema/typings'
import { validateArray } from '../schema/validateArray'
import { validateObject } from '../schema/validateObject'
import { validatePrimitive } from '../schema/validatePrimitive'
import { validateRecord } from '../schema/validateRecord'
import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue } from '@oats-ts/validators'
import { getInferredType, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { validateEnum } from '../schema/validateEnum'

function validateEnumOrPrimitive(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  validated: Set<SchemaObject>,
): Issue[] {
  const { dereference } = context
  const input = dereference(data)
  if (getInferredType(input) === 'enum') {
    return validateEnum(input, context, validated)
  } else {
    return validatePrimitive(input, context, validated)
  }
}

export const validateObjectSchema = validateObject(validateEnumOrPrimitive)
export const validateRecordSchema = validateRecord(validateEnumOrPrimitive)
export const validateArraySchema = validateArray(validateEnumOrPrimitive)

export function validateParameterSchema(
  input: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
): Issue[] {
  const { uriOf } = context
  const type = getInferredType(input)
  switch (type) {
    case 'object':
      return validateObjectSchema(input, context, new Set())
    case 'record':
      return validateRecordSchema(input, context, new Set())
    case 'array':
      return validateArraySchema(input, context, new Set())
    case 'string':
    case 'number':
    case 'boolean':
      return validatePrimitive(input, context, new Set())
    case 'enum':
      return validateEnum(input, context, new Set())
    default:
      return [
        {
          message:
            'should be either a primitive schema ("string", "number" or "boolean") or array/object of primitives',
          path: uriOf(input),
          severity: 'error',
          type: 'other',
        },
      ]
  }
}
