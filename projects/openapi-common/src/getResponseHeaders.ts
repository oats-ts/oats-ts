import { HeadersObject, OperationObject } from '@oats-ts/openapi-model'
import { entries, isNil, values } from 'lodash'
import { OpenAPIGeneratorContext } from './typings'

export function getResponseHeaders(
  operation: OperationObject,
  context: OpenAPIGeneratorContext,
): Record<string, HeadersObject> {
  const responses = entries(operation.responses || {})
  const result: Record<string, HeadersObject> = {}
  responses.forEach(([statusCode, responseOrRef]) => {
    const { headers } = context.dereference(responseOrRef, true) || {}
    if (!isNil(headers) && values(headers).length > 0) {
      result[statusCode] = headers
    }
  })
  return result
}
