import { OperationObject } from '@oats-ts/openapi-model'
import { isNil, flatMap } from 'lodash'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { parametersOf } from '../utils/modelUtils'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'
import { structural } from '../structural'

export function operationObject(
  data: OperationObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() =>
    ordered(() => structural.operationObject(data, context.uriOf(data), validatorConfig))(
      () =>
        flatMap(parametersOf(data, context), (p) => referenceable(config.parameterObject, true)(p, context, config)),
      () => (isNil(data.requestBody) ? [] : referenceable(config.requestBodyObject)(data.requestBody, context, config)),
      () => config.responsesObject(data.responses, context, config),
    ),
  )
}
