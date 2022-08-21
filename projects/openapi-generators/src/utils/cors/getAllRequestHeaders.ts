import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { PathItemObject } from '@oats-ts/openapi-model'
import { getRequestHeaderNames } from './getRequestHeaderNames'

export function getAllRequestHeaders(pathItem: PathItemObject, context: OpenAPIGeneratorContext): string[] {
  const { get, put, post, delete: _delete, options, head, patch, trace } = pathItem
  const headers = new Set([
    ...getRequestHeaderNames(get, context),
    ...getRequestHeaderNames(put, context),
    ...getRequestHeaderNames(post, context),
    ...getRequestHeaderNames(_delete, context),
    ...getRequestHeaderNames(options, context),
    ...getRequestHeaderNames(head, context),
    ...getRequestHeaderNames(patch, context),
    ...getRequestHeaderNames(trace, context),
  ])
  return Array.from(headers)
}
