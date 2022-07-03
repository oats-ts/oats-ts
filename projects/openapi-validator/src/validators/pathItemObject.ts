import { PathItemObject } from '@oats-ts/openapi-model'
import { flatMap } from 'lodash'
import { Issue, object, optional, shape, combine, array } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ignore } from '../utils/ignore'
import { operationsOf, parametersOf } from '../utils/modelUtils'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(
  combine(
    shape<PathItemObject>(
      {
        get: optional(object()),
        put: optional(object()),
        post: optional(object()),
        delete: optional(object()),
        options: optional(object()),
        head: optional(object()),
        patch: optional(object()),
        parameters: optional(array()),
      },
      true,
    ),
    ignore(['$ref', 'servers']),
  ),
)

export function pathItemObject(
  data: PathItemObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    const { uriOf } = context
    const { operationObject, parameterObject } = config
    return ordered(() => validator(data, uriOf(data), validatorConfig))(
      () => flatMap(operationsOf(data), (operation) => operationObject(operation, context, config)),
      () => flatMap(parametersOf(data, context), (param) => parameterObject(param, context, config)),
    )
  })
}
