import { isNil } from 'lodash'
import { ContentObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'

export function getRequestBodyContent(data: EnhancedOperation, context: OpenAPIGeneratorContext): ContentObject {
  const { accessor } = context
  const { operation } = data
  const { requestBody: bodyOrRef } = operation

  if (isNil(bodyOrRef)) {
    return {}
  }

  const requestBody = accessor.dereference(bodyOrRef)
  const { content } = requestBody

  if (isNil(content)) {
    return {}
  }

  return content
}
