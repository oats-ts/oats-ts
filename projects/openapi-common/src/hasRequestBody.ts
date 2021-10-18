import { keys } from 'lodash'
import { getRequestBodyContent } from './getRequestBodyContent'
import { EnhancedOperation, OpenAPIGeneratorContext } from './typings'

export function hasRequestBody(data: EnhancedOperation, context: OpenAPIGeneratorContext) {
  return keys(getRequestBodyContent(data, context)).length > 0
}
