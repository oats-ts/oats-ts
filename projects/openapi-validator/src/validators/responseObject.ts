import { ResponseObject } from '@oats-ts/openapi-model'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { isNil } from 'lodash'
import { structural } from '../structural'

export function responseObject(
  data: ResponseObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() =>
    ordered(() => structural.responseObject(data, context.uriOf(data), validatorConfig))(() =>
      isNil(data.content) ? [] : config.contentObject(data.content, context, config),
    ),
  )
}
