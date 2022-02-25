import { SchemaObject } from '@oats-ts/json-schema-model'
import { Issue } from '@oats-ts/validators'
import { isNil } from 'lodash'
import { discriminatedUnionSchemaObject } from './discriminatedUnionSchemaObject'
import { nonDiscriminatedSchemaObject } from './nonDiscriminatedSchemaObject'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'

export function unionSchemaObject(
  input: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return isNil(input.discriminator)
    ? nonDiscriminatedSchemaObject(input, context, config)
    : discriminatedUnionSchemaObject(input, context, config)
}
