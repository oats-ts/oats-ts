import { OpenAPIObject } from '@oats-ts/openapi-model'
import { Issue, object, optional, shape } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { isNil } from 'lodash'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(
  shape<OpenAPIObject>(
    {
      paths: optional(object()),
      components: optional(object()),
    },
    true,
  ),
)

export function openApiObject(
  data: OpenAPIObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    const { componentsObject, pathsObject } = config
    const { uriOf } = context
    return ordered(() => validator(data, uriOf(data), validatorConfig))(
      () => (isNil(data.components) ? [] : componentsObject(data.components, context, config)),
      () => (isNil(data.paths) ? [] : pathsObject(data.paths, context, config)),
    )
  })
}
