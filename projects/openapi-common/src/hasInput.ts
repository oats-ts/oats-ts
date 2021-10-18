import { hasRequestBody } from './hasRequestBody'
import { EnhancedOperation, OpenAPIGeneratorContext } from './typings'

export function hasInput(data: EnhancedOperation, context: OpenAPIGeneratorContext): boolean {
  const { header, path, query } = data
  return header.length > 0 || query.length > 0 || path.length > 0 || hasRequestBody(data, context)
}
