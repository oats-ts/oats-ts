import { values, isEmpty } from 'lodash'
import { OperationObject } from 'openapi3-ts'
import { getResponseSchemas } from './getResponseSchemas'
import { OpenAPIGeneratorContext } from './typings'

export function hasResponses(operation: OperationObject, context: OpenAPIGeneratorContext): boolean {
  return !isEmpty(values(getResponseSchemas(operation, context)))
}
