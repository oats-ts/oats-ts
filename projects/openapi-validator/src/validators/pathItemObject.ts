import { PathItemObject } from '@oats-ts/openapi-model'
import { flatMap } from 'lodash'
import { Issue, object, optional, shape, combine, array, ShapeInput, restrictKeys } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { operationsOf, parametersOf } from '../utils/modelUtils'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const pathItemShape: ShapeInput<PathItemObject> = {
  get: optional(object()),
  put: optional(object()),
  post: optional(object()),
  delete: optional(object()),
  options: optional(object()),
  head: optional(object()),
  patch: optional(object()),
  parameters: optional(array()),
}

const validator = object(combine(shape<PathItemObject>(pathItemShape), restrictKeys(Object.keys(pathItemShape))))

export function pathItemObject(
  data: PathItemObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() =>
    ordered(() => validator(data, context.uriOf(data), validatorConfig))(
      () => flatMap(operationsOf(data), (operation) => config.operationObject(operation, context, config)),
      () => flatMap(parametersOf(data, context), (param) => config.parameterObject(param, context, config)),
    ),
  )
}
