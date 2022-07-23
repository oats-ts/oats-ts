import { Issue } from '@oats-ts/validators'
import { ParameterObject } from '@oats-ts/openapi-model'
import { validatorConfig } from '../utils/validatorConfig'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'

export function cookieParameterObject(
  input: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return [
    {
      message: '"cookie" parameters are ignored',
      path: validatorConfig.append(context.uriOf(input), 'in'),
      severity: 'warning',
    },
  ]
}
