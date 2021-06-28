import { keys } from 'lodash'
import { getRequestBodyContent } from './getRequestBodyContent'
import { EnhancedOperation, OpenAPIGeneratorContext } from './typings'

export function hasInput(data: EnhancedOperation, context: OpenAPIGeneratorContext): boolean {
  const { header, path, query } = data
  return (
    header.length > 0 || query.length > 0 || path.length > 0 || keys(getRequestBodyContent(data, context)).length > 0
  )
}
