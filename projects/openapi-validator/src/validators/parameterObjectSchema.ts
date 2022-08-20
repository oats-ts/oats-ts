import { arraySchemaObject } from './arraySchemaObject'
import { objectSchemaObject } from './objectSchemaObject'
import { primitiveSchemaObject } from './primitiveSchemaObject'
import { recordSchemaObject } from './recordSchemaObject'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { Issue } from '@oats-ts/validators'
import { enumSchemaObject } from './enumSchemaObject'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { getInferredType } from '@oats-ts/model-common'

function parameterObjectEnumOrPrimitiveSchema(
  data: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  if (getInferredType(data) === 'enum') {
    return enumSchemaObject(data, context, config)
  } else {
    return primitiveSchemaObject(data, context, config)
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
          path: context.uriOf(input),
          severity: 'error',
        },
      ]
  }
}
