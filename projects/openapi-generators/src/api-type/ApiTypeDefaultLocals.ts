import { OperationObject } from '@oats-ts/openapi-model'
import { camelCase } from 'lodash'

export const ApiTypeDefaultLocals = {
  request: 'request',
  apiMethodName: (operation: OperationObject): string => camelCase(operation.operationId),
}
