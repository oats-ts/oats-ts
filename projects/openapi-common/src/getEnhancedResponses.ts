import { isNil, entries } from 'lodash'
import { OperationObject, ResponseObject } from '@oats-ts/openapi-model'
import { EnhancedResponse, OpenAPIGeneratorContext } from './typings'

export function getEnhancedResponses(operation: OperationObject, context: OpenAPIGeneratorContext): EnhancedResponse[] {
  const responses: EnhancedResponse[] = []

  for (const [statusCode, resOrRef] of entries(operation.responses || {})) {
    const repsonse = isNil(resOrRef) ? undefined : context.dereference<ResponseObject>(resOrRef, true)
    const content = entries(repsonse?.content || {})
    if (content.length === 0) {
      responses.push({
        mediaType: undefined,
        statusCode,
        schema: undefined,
        headers: repsonse?.headers || {},
      })
    } else {
      for (const [mediaType, mediaTypeObj] of content) {
        const schema = isNil(mediaTypeObj?.schema) ? undefined : context.dereference(mediaTypeObj.schema)
        responses.push({
          mediaType,
          statusCode,
          schema,
          headers: repsonse?.headers || {},
        })
      }
    }
  }
  return responses
}
