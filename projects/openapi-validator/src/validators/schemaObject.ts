import { SchemaObject } from '@oats-ts/json-schema-model'
import { Issue } from '@oats-ts/validators'
import { unionSchemaObject } from './unionSchemaObject'
import { enumSchemaObject } from './enumSchemaObject'
import { primitiveSchemaObject } from './primitiveSchemaObject'
import { recordSchemaObject } from './recordSchemaObject'
import { objectSchemaObject } from './objectSchemaObject'
import { arraySchemaObject } from './arraySchemaObject'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { intersectionSchemaObject } from './intersectionSchemaObject'
import { getInferredType } from '@oats-ts/model-common'

export function schemaObject(
  data: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  switch (getInferredType(data)) {
    case 'array':
      return arraySchemaObject()(data, context, config)
    case 'boolean':
    case 'string':
    case 'number':
      return primitiveSchemaObject(data, context, config)
    case 'enum':
      return enumSchemaObject(data, context, config)
    case 'object':
      return objectSchemaObject()(data, context, config)
    case 'record':
      return recordSchemaObject()(data, context, config)
    case 'union':
      return unionSchemaObject(data, context, config)
    case 'intersection':
      return intersectionSchemaObject()(data, context, config)
    default:
      return []
  }
}
