import { ReferenceObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from './isReferenceObject'
import { ReadOutput } from './types'

export function dereference(data: ReadOutput<any>) {
  return function _dereference<T>(input: T | ReferenceObject | string, deep: boolean = false): T {
    if (typeof input === 'string') {
      return deep ? _dereference(data.uriToObject.get(input)) : data.uriToObject.get(input)
    } else if (isReferenceObject(input)) {
      return deep ? _dereference(data.uriToObject.get(input.$ref)) : data.uriToObject.get(input.$ref)
    }
    return input
  }
}
