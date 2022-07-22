import { SchemaObject } from '@oats-ts/json-schema-model'
import { combine, enumeration, Issue, object, optional, restrictKeys, shape, string } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ifNotValidated } from '../utils/ifNotValidated'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'

const primitiveShape = {
  description: optional(string()),
  type: enumeration(['string', 'boolean', 'number', 'integer']),
}

const validator = object(combine(shape(primitiveShape), restrictKeys(Object.keys(primitiveShape))))

export function primitiveSchemaObject(
  schema: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    schema,
  )(() => {
    const { uriOf } = context
    return validator(schema, uriOf(schema), validatorConfig)
  })
}
