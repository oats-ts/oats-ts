import { OperationObject } from 'openapi3-ts'
import { isNil } from 'lodash'
import { Issue, object, optional, shape, combine, record, string, minLength, array } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../append'
import { validateParameters } from '../parameters/validateParameters'
import { validateRequestBody } from '../requestBody/validateRequestBody'
import { validateResponses } from '../response/validateResponses'
import { ignore } from '../ignore'
import { ordered } from '../ordered'

const validator = object(
  combine(
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
  ),
)

export const validateOperation = (data: OperationObject, context: OpenAPIGeneratorContext): Issue[] => {
  const { uriOf } = context
  return ordered(() => validator(data, { append, path: uriOf(data) }))(
    () => (isNil(data.parameters) ? [] : validateParameters(data.parameters || [], context)),
    () => (isNil(data.requestBody) ? [] : validateRequestBody(data.requestBody, context)),
    () => validateResponses(data.responses, context),
  )
}
