import { Issue, object, optional, shape, combine, string, literal, boolean } from '@oats-ts/validators'
import { ParameterObject } from '@oats-ts/openapi-model'
import { validatorConfig } from '../utils/validatorConfig'
import { parameterObjectSchema } from './parameterObjectSchema'
import { warnContent } from '../utils/warnContent'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { referenceable } from './referenceable'

const validator = object(
  combine(
    shape<ParameterObject>(
      {
        name: string(),
        in: literal('header'),
        required: optional(boolean()),
        style: optional(literal('simple')),
        schema: object(),
      },
      true,
    ),
    warnContent,
  ),
)

export function headerParameterObject(
  input: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  const { uriOf } = context
  return ordered(() => validator(input, uriOf(input), validatorConfig))(() =>
    referenceable(parameterObjectSchema)(input.schema, context, config),
  )
}
