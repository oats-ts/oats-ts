import { SchemaObject } from '@oats-ts/json-schema-model'
import { Issue } from '@oats-ts/validators'
import { isNil } from 'lodash'
import { discriminatedUnionSchemaObject } from './discriminatedUnionSchemaObject'
import { primitiveUnionSchemaObject } from './primitiveUnionSchemaObject'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'

export function unionSchemaObject(
  input: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return isNil(input.discriminator)
    ? primitiveUnionSchemaObject(input, context, config)
    : discriminatedUnionSchemaObject(input, context, config)
}
