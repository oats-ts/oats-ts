import { SchemaObject } from '@oats-ts/json-schema-model'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { structural } from '../structural'

export function enumSchemaObject(
  data: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(context, data)(() => structural.enumSchemaObject(data, context.uriOf(data), validatorConfig))
}
