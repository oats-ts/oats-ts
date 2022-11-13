import { OpenAPIObject } from '@oats-ts/openapi-model'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { isNil } from 'lodash'
import { ifNotValidated } from '../utils/ifNotValidated'
import { structural } from '../structural'

export function openApiObject(
  data: OpenAPIObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() =>
    ordered(() => structural.openApiObject(data, context.uriOf(data), validatorConfig))(
      () => (isNil(data.components) ? [] : config.componentsObject(data.components, context, config)),
      () => (isNil(data.paths) ? [] : config.pathsObject(data.paths, context, config)),
    ),
  )
}
