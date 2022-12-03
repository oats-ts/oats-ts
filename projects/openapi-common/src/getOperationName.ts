import { BaseHelper } from '@oats-ts/oats-ts'
import { OperationObject, PathItemObject, PathsObject } from '@oats-ts/openapi-model'
import { entries, isNil } from 'lodash'
import { getSanitizedName } from './getSanitizedName'

export function getOperationName(operation: OperationObject, helper: BaseHelper): string {
  if (!isNil(operation.operationId)) {
    return getSanitizedName(operation.operationId)
  }

  const pathItem = helper.parent<OperationObject, PathItemObject>(operation)

  if (isNil(pathItem)) {
    throw new TypeError(`Orphaned operation: ${JSON.stringify(operation)}`)
  }

  const methodWithOperation = entries(pathItem).find(([, value]) => value === operation)

  if (isNil(methodWithOperation)) {
    throw new TypeError(`Orphaned operation: ${JSON.stringify(operation)}`)
  }

  const [method] = methodWithOperation

  const paths = helper.parent<PathItemObject, PathsObject>(pathItem)

  if (isNil(paths)) {
    throw new TypeError(`Orphaned path item: ${JSON.stringify(pathItem)}`)
  }

  const pathsWithPathItem = entries(paths).find(([, value]) => value === pathItem)

  if (isNil(pathsWithPathItem)) {
    throw new TypeError(`Orphaned path item: ${JSON.stringify(pathItem)}`)
  }

  const [url] = pathsWithPathItem

  return `${getSanitizedName(method)}_${getSanitizedName(url)}`
}
