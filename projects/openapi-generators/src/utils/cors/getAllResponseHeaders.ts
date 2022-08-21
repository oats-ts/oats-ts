import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { PathItemObject } from '@oats-ts/openapi-model'
import { getResponseHeaderNames } from './getResponseHeaderNames'

export function getAllResponseHeaders(pathItem: PathItemObject, context: OpenAPIGeneratorContext): string[] {
  const { get, put, post, delete: _delete, options, head, patch, trace } = pathItem
  const headers = new Set([
    ...getResponseHeaderNames(get, context),
    ...getResponseHeaderNames(put, context),
    ...getResponseHeaderNames(post, context),
    ...getResponseHeaderNames(_delete, context),
    ...getResponseHeaderNames(options, context),
    ...getResponseHeaderNames(head, context),
    ...getResponseHeaderNames(patch, context),
    ...getResponseHeaderNames(trace, context),
  ])
  return Array.from(headers)
}
