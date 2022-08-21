import { PathItemObject } from '@oats-ts/openapi-model'
import { isNil } from 'lodash'

export function getAllMethods(pathItem: PathItemObject): string[] {
  const { get, put, post, delete: _delete, options, head, patch, trace } = pathItem
  return [
    ...(isNil(get) ? [] : ['GET']),
    ...(isNil(put) ? [] : ['PUT']),
    ...(isNil(post) ? [] : ['POST']),
    ...(isNil(_delete) ? [] : ['DELETE']),
    ...(isNil(options) ? [] : ['OPTIONS']),
    ...(isNil(head) ? [] : ['HEAD']),
    ...(isNil(patch) ? [] : ['PATCH']),
    ...(isNil(trace) ? [] : ['TRACE']),
  ]
}
