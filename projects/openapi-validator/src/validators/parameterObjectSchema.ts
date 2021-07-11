import { arraySchemaObject } from '../schema/arraySchemaObject'
import { objectSchemaObject } from '../schema/objectSchemaObject'
import { primitiveSchemaObject } from '../schema/primitiveSchemaObject'
import { recordSchemaObject } from '../schema/recordSchemaObject'
import { SchemaObject } from 'openapi3-ts'
import { Issue } from '@oats-ts/validators'
import { getInferredType } from '@oats-ts/openapi-common'
import { enumSchemaObject } from '../schema/enumSchemaObject'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'

function parameterObjectEnumOrPrimitiveSchema(
  data: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  const { dereference } = context
  const input = dereference(data)
  if (getInferredType(input) === 'enum') {
    return enumSchemaObject(input, context, config)
  } else {
    return primitiveSchemaObject(input, context, config)
  }
}

export const parameterObjectObjectSchema = objectSchemaObject(parameterObjectEnumOrPrimitiveSchema)
export const parameterObjectRecordSchema = recordSchemaObject(parameterObjectEnumOrPrimitiveSchema)
export const paramterObjectArraySchema = arraySchemaObject(parameterObjectEnumOrPrimitiveSchema)

export function parameterObjectSchema(
  input: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  const { uriOf } = context
  const type = getInferredType(input)
  switch (type) {
    case 'object':
      return parameterObjectObjectSchema(input, context, config)
    case 'record':
      return parameterObjectRecordSchema(input, context, config)
    case 'array':
      return paramterObjectArraySchema(input, context, config)
    case 'string':
    case 'number':
    case 'boolean':
      return primitiveSchemaObject(input, context, config)
    case 'enum':
      return enumSchemaObject(input, context, config)
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
