import { Issue } from '@oats-ts/validators'
import { ParameterObject } from '@oats-ts/openapi-model'
import { append } from '../utils/append'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'

export function cookieParameterObject(
  input: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  const { uriOf } = context
  return [
    {
      message: '"cookie" parameters are ignored',
      path: append(uriOf(input), 'in'),
      severity: 'warning',
      type: 'other',
    },
  ]
}
