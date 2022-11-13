import { Issue } from '@oats-ts/validators'
import { ParameterObject } from '@oats-ts/openapi-model'
import { validatorConfig } from '../utils/validatorConfig'
import { parameterObjectSchema } from './parameterObjectSchema'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { referenceable } from './referenceable'
import { structural } from '../structural'

export function pathParameterObject(
  data: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ordered(() => structural.pathParameterObject(data, context.uriOf(data), validatorConfig))(() =>
    referenceable(parameterObjectSchema)(data.schema!, context, config),
  )
}
