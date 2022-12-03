import { BaseHelper } from '@oats-ts/oats-ts'
import { getOperationName } from '@oats-ts/openapi-common'
import { OperationObject } from '@oats-ts/openapi-model'
import { camelCase } from 'lodash'

export const ApiTypeDefaultLocals = {
  request: 'request',
  apiMethodName: (operation: OperationObject, helper: BaseHelper): string =>
    camelCase(getOperationName(operation, helper)),
}
