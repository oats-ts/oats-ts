import { isNil, entries } from 'lodash'
import { OperationObject, ResponseObject } from '@oats-ts/openapi-model'
import { EnhancedResponse, OpenAPIGeneratorContext } from './typings'

export function getEnhancedResponses(operation: OperationObject, context: OpenAPIGeneratorContext): EnhancedResponse[] {
  const { dereference } = context
  const responses: EnhancedResponse[] = []

  for (const [statusCode, resOrRef] of entries(operation.responses || {})) {
    const repsonse = dereference<ResponseObject>(resOrRef, true)
    for (const [mediaType, mediaTypeObj] of entries(repsonse.content || {})) {
      if (!isNil(mediaTypeObj.schema)) {
        responses.push({
          mediaType,
          statusCode,
          schema: dereference(mediaTypeObj.schema),
        })
      }
    }
  }
  return responses
}
