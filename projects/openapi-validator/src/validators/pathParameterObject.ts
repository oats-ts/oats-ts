import { Issue, object, optional, shape, combine, string, literal, enumeration } from '@oats-ts/validators'
import { ParameterObject } from '@oats-ts/openapi-model'
import { validatorConfig } from '../utils/validatorConfig'
import { parameterObjectSchema } from './parameterObjectSchema'
import { warnContent } from '../utils/warnContent'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { referenceable } from './referenceable'

const validator = object(
  combine([
    shape<ParameterObject>(
      {
        name: string(),
        in: literal('path'),
        required: literal(true),
        style: optional(enumeration(['simple', 'label', 'matrix'])),
        schema: object(),
      },
      true,
    ),
    warnContent,
  ]),
)

export function pathParameterObject(
  data: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  const { uriOf } = context
  return ordered(() => validator(data, uriOf(data), validatorConfig))(() =>
    referenceable(parameterObjectSchema)(data.schema, context, config),
  )
}
