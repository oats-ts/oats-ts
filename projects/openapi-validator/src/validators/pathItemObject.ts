import { PathItemObject } from '@oats-ts/openapi-model'
import { flatMap } from 'lodash'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { operationsOf, parametersOf } from '../utils/modelUtils'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { structural } from '../structural'

export function pathItemObject(
  data: PathItemObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() =>
    ordered(() => structural.pathItemObject(data, context.uriOf(data), validatorConfig))(
      () => flatMap(operationsOf(data), (operation) => config.operationObject(operation, context, config)),
      () => flatMap(parametersOf(data, context), (param) => config.parameterObject(param, context, config)),
    ),
  )
}
