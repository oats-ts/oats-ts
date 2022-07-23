import {
  Issue,
  object,
  optional,
  shape,
  combine,
  string,
  literal,
  boolean,
  ShapeInput,
  restrictKeys,
} from '@oats-ts/validators'
import { ParameterObject } from '@oats-ts/openapi-model'
import { validatorConfig } from '../utils/validatorConfig'
import { parameterObjectSchema } from './parameterObjectSchema'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { referenceable } from './referenceable'

const headerShape: ShapeInput<ParameterObject> = {
  name: string(),
  in: literal('header'),
  required: optional(boolean()),
  style: optional(literal('simple')),
  explode: optional(boolean()),
  description: optional(string()),
  schema: object(),
}

const validator = object(combine(shape<ParameterObject>(headerShape), restrictKeys(Object.keys(headerShape))))

export function headerParameterObject(
  input: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ordered(() => validator(input, context.uriOf(input), validatorConfig))(() =>
    referenceable(parameterObjectSchema)(input.schema!, context, config),
  )
}
