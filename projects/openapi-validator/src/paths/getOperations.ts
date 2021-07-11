import { PathItemObject, OperationObject } from 'openapi3-ts'
import { isNil, negate } from 'lodash'

export function getOperations(data: PathItemObject): OperationObject[] {
  const { get, put, post, delete: _delete, options, head, patch } = data
  return [get, put, post, _delete, options, head, patch].filter(negate(isNil))
}
