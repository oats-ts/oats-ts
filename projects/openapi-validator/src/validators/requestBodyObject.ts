import { RequestBodyObject } from '@oats-ts/openapi-model'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { structural } from '../structural'

export function requestBodyObject(
  data: RequestBodyObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() =>
    ordered(() => structural.requestBodyObject(data, context.uriOf(data), validatorConfig))(() =>
      config.contentObject(data.content ?? {}, context, config),
    ),
  )
}
