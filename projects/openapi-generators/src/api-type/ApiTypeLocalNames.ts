import { OperationObject } from '@oats-ts/openapi-model'
import { camelCase } from 'lodash'

export const ApiTypeLocalNames = {
  request: 'request',
  methodName: (operation: OperationObject): string => camelCase(operation.operationId),
}
