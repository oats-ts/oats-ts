import { SchemaObject } from '@oats-ts/json-schema-model'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ifNotValidated } from '../utils/ifNotValidated'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { structural } from '../structural'

export function primitiveSchemaObject(
  schema: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    schema,
  )(() => {
    return structural.primitiveSchemaObject(schema, context.uriOf(schema), validatorConfig)
  })
}
