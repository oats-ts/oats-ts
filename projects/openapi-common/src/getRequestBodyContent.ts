import { isNil } from 'lodash'
import { ContentObject } from 'openapi3-ts'
import { EnhancedOperation, OpenAPIGeneratorContext } from './typings'

export function getRequestBodyContent(data: EnhancedOperation, context: OpenAPIGeneratorContext): ContentObject {
  const { dereference } = context
  const { operation } = data
  const { requestBody: bodyOrRef } = operation

  if (isNil(bodyOrRef)) {
    return {}
  }

  const requestBody = dereference(bodyOrRef)
  const { content } = requestBody

  if (isNil(content)) {
    return {}
  }

  return content
}
