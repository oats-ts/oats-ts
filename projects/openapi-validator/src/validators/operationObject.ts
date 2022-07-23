import { OperationObject } from '@oats-ts/openapi-model'
import { isNil, flatMap } from 'lodash'
import {
  Issue,
  object,
  optional,
  shape,
  combine,
  record,
  string,
  minLength,
  array,
  ShapeInput,
  restrictKeys,
} from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { parametersOf } from '../utils/modelUtils'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'

const operationShape: ShapeInput<OperationObject> = {
  description: optional(string()),
  summary: optional(string()),
  operationId: string(minLength(1)),
  parameters: optional(array()),
  requestBody: optional(object()),
  responses: object(record(string(), object())),
}

const validator = object(combine(shape<OperationObject>(operationShape), restrictKeys(Object.keys(operationShape))))

export function operationObject(
  data: OperationObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() =>
    ordered(() => validator(data, context.uriOf(data), validatorConfig))(
      () =>
        flatMap(parametersOf(data, context), (p) => referenceable(config.parameterObject, true)(p, context, config)),
      () => (isNil(data.requestBody) ? [] : referenceable(config.requestBodyObject)(data.requestBody, context, config)),
      () => config.responsesObject(data.responses, context, config),
    ),
  )
}
