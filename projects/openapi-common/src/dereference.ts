import { isReferenceObject, ReferenceObject } from 'openapi3-ts'
import { OpenAPIReadOutput } from '../../openapi-reader/lib'

export function dereference(data: OpenAPIReadOutput) {
  return function _dereference<T>(input: T | ReferenceObject | string, deep: boolean = false): T {
    if (typeof input === 'string') {
      return deep ? _dereference(data.uriToObject.get(input)) : data.uriToObject.get(input)
    } else if (isReferenceObject(input)) {
      return deep ? _dereference(data.uriToObject.get(input.$ref)) : data.uriToObject.get(input.$ref)
    }
    return input
  }
}
