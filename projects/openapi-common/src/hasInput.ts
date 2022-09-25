import { hasRequestBody } from './hasRequestBody'
import { EnhancedOperation, OpenAPIGeneratorContext } from './typings'

export function hasInput(data: EnhancedOperation, context: OpenAPIGeneratorContext, checkCookie: boolean): boolean {
  const { header, path, query, cookie } = data
  return (
    header.length > 0 ||
    query.length > 0 ||
    path.length > 0 ||
    (checkCookie && cookie.length > 0) ||
    hasRequestBody(data, context)
  )
}
