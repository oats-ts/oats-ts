import { OpenAPIObject } from 'openapi3-ts'
import { Issue, object, optional, shape } from '@oats-ts/validators'
import { append } from '../utils/append'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { isNil } from 'lodash'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(
  shape<OpenAPIObject>({
    paths: optional(object()),
    components: optional(object()),
  }),
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
    const { uriOf } = context
    return ordered(() => validator(data, { append, path: uriOf(data) }))(
      () => (isNil(data.components) ? [] : config.componentsObject(data.components, context, config)),
      () => (isNil(data.paths) ? [] : config.pathsObject(data.paths, context, config)),
    )
  })
}
