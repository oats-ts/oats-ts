import { SchemaObject } from '@oats-ts/json-schema-model'
import {
  Issue,
  object,
  shape,
  combine,
  array,
  minLength,
  ShapeInput,
  optional,
  string,
  restrictKeys,
} from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const enumShape: ShapeInput<SchemaObject> = {
  description: optional(string()),
  type: optional(string()),
  enum: array(minLength(1)),
}

const validator = object(combine(shape<SchemaObject>(enumShape), restrictKeys(Object.keys(enumShape))))

export function enumSchemaObject(
  data: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(context, data)(() => validator(data, context.uriOf(data), validatorConfig))
}
