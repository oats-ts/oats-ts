import { isReferenceObject, ReferenceObject } from 'openapi3-ts'
import { OpenAPIReadOutput } from '../../openapi-reader/lib'

export function dereference(data: OpenAPIReadOutput) {
  return function _dereference<T>(input: T | ReferenceObject | string): T {
    if (typeof input === 'string') {
      return data.uriToObject.get(input)
    } else if (isReferenceObject(input)) {
      return data.uriToObject.get(input.$ref)
    }
    return input
  }
}
