import { Issue } from '@oats-ts/validators'
import { ParameterObject } from '@oats-ts/openapi-model'
import { validatorConfig } from '../utils/validatorConfig'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ordered } from '../utils/ordered'
import { referenceable } from './referenceable'
import { parameterObjectPrimitiveSchema } from './parameterObjectSchema'
import { structural } from '../structural'

export function cookieParameterObject(
  input: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ordered(() => structural.cookieParameterObject(input, context.uriOf(input), validatorConfig))(() =>
    referenceable(parameterObjectPrimitiveSchema)(input.schema!, context, config),
  )
}
