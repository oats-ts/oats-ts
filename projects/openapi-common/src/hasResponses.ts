import { isEmpty } from 'lodash'
import { OperationObject } from '@oats-ts/openapi-model'
import { getEnhancedResponses } from './getEnhancedResponses'
import { OpenAPIGeneratorContext } from './typings'

export function hasResponses(operation: OperationObject, context: OpenAPIGeneratorContext): boolean {
  return !isEmpty(getEnhancedResponses(operation, context))
}
