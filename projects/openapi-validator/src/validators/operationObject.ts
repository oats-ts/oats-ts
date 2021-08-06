import { OperationObject } from '@oats-ts/openapi-model'
import { isNil, flatMap } from 'lodash'
import { Issue, object, optional, shape, combine, record, string, minLength, array } from '@oats-ts/validators'
import { append } from '../utils/append'
import { ignore } from '../utils/ignore'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { parametersOf } from '../utils/modelUtils'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'

const validator = object(
  combine([
    shape<OperationObject>(
      {
        operationId: string(minLength(1)),
        parameters: optional(array()),
        requestBody: optional(object()),
        responses: object(record(string(), object())),
      },
      true,
    ),
    ignore(['security', 'servers', 'callbacks']),
  ]),
)

export function operationObject(
  data: OperationObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    const { uriOf } = context
    const { parameterObject, requestBodyObject, responsesObject } = config
    return ordered(() => validator(data, { append, path: uriOf(data) }))(
      () => flatMap(parametersOf(data, context), (p) => referenceable(parameterObject, true)(p, context, config)),
      () => (isNil(data.requestBody) ? [] : referenceable(requestBodyObject)(data.requestBody, context, config)),
      () => responsesObject(data.responses, context, config),
    )
  })
}
