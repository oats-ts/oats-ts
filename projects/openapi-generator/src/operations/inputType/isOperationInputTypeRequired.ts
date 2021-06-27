import { keys } from 'lodash'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getRequestBodyContent } from './getRequestBodyContent'

export function isOperationInputTypeRequired(data: EnhancedOperation, context: OpenAPIGeneratorContext): boolean {
  const { header, path, query } = data
  return (
    header.length > 0 || query.length > 0 || path.length > 0 || keys(getRequestBodyContent(data, context)).length > 0
  )
}
