import {
  Issue,
  object,
  optional,
  shape,
  combine,
  string,
  literal,
  enumeration,
  ShapeInput,
  restrictKeys,
  boolean,
} from '@oats-ts/validators'
import { ParameterObject } from '@oats-ts/openapi-model'
import { validatorConfig } from '../utils/validatorConfig'
import { parameterObjectSchema } from './parameterObjectSchema'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { referenceable } from './referenceable'

const pathParamShape: ShapeInput<ParameterObject> = {
  name: string(),
  in: literal('path'),
  required: literal(true),
  explode: optional(boolean()),
  description: optional(string()),
  style: optional(enumeration(['simple', 'label', 'matrix'])),
  schema: object(),
}

const validator = object(combine(shape<ParameterObject>(pathParamShape), restrictKeys(Object.keys(pathParamShape))))

export function pathParameterObject(
  data: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  const { uriOf } = context
  return ordered(() => validator(data, uriOf(data), validatorConfig))(() =>
    referenceable(parameterObjectSchema)(data.schema!, context, config),
  )
}
