import { isNil } from 'lodash'
import { ContentObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext } from './typings'

export function getRequestBodyContent(data: EnhancedOperation, context: OpenAPIGeneratorContext): ContentObject {
  const { operation } = data
  const { requestBody: bodyOrRef } = operation

  if (isNil(bodyOrRef)) {
    return {}
  }

  const requestBody = context.dereference(bodyOrRef)
  const { content } = requestBody

  if (isNil(content)) {
    return {}
  }

  return content
}
