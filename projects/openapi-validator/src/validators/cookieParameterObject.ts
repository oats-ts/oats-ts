import { combine, Issue, literal, object, optional, restrictKeys, shape, ShapeInput, string } from '@oats-ts/validators'
import { ParameterObject } from '@oats-ts/openapi-model'
import { validatorConfig } from '../utils/validatorConfig'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ordered } from '../utils/ordered'
import { referenceable } from './referenceable'
import { parameterObjectPrimitiveSchema } from './parameterObjectSchema'

const cookieShape: ShapeInput<ParameterObject> = {
  name: string(),
  in: literal('cookie'),
  required: optional(literal(false)),
  style: optional(literal('form')),
  explode: optional(literal(false)),
  description: optional(string()),
  schema: object(),
}

const validator = object(combine(shape<ParameterObject>(cookieShape), restrictKeys(Object.keys(cookieShape))))

export function cookieParameterObject(
  input: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ordered(() => validator(input, context.uriOf(input), validatorConfig))(() =>
    referenceable(parameterObjectPrimitiveSchema)(input.schema!, context, config),
  )
}
