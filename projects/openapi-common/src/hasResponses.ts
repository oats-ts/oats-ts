import { isEmpty } from 'lodash'
import { OperationObject } from 'openapi3-ts'
import { getEnhancedResponses } from './getEnhancedResponses'
import { OpenAPIGeneratorContext } from './typings'

export function hasResponses(operation: OperationObject, context: OpenAPIGeneratorContext): boolean {
  return !isEmpty(getEnhancedResponses(operation, context))
}
