import { HttpMethod } from '@oats-ts/openapi-http'
import { PathItemObject } from '@oats-ts/openapi-model'
import { isNil } from 'lodash'

export function getRequestMethods(path: PathItemObject): HttpMethod[] {
  const { get, post, put, patch, trace, options, head, delete: _delete } = path
  const methods: (HttpMethod | undefined)[] = [
    isNil(get) ? undefined : 'get',
    isNil(post) ? undefined : 'post',
    isNil(put) ? undefined : 'put',
    isNil(patch) ? undefined : 'patch',
    isNil(trace) ? undefined : 'trace',
    isNil(options) ? undefined : 'options',
    isNil(head) ? undefined : 'head',
    isNil(_delete) ? undefined : 'delete',
  ]
  return methods.filter((method): method is HttpMethod => !isNil(method))
}
