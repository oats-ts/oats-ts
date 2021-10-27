import { OperationObject } from '@oats-ts/openapi-model'
import { values } from 'lodash'
import { getResponseHeaders } from './getResponseHeaders'
import { OpenAPIGeneratorContext } from './typings'

export function hasResponseHeaders(operation: OperationObject, context: OpenAPIGeneratorContext): boolean {
  return values(getResponseHeaders(operation, context)).length > 0
}
