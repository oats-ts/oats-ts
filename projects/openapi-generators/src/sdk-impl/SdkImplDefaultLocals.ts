import { BaseHelper } from '@oats-ts/oats-ts'
import { getOperationName } from '@oats-ts/openapi-common'
import { OperationObject } from '@oats-ts/openapi-model'
import camelcase from 'camelcase'

export const SdkImplDefaultLocals = {
  adapterParameter: 'adapter',
  adapterProperty: 'adapter',
  request: 'request',
  operationFactoryMethod: (operation: OperationObject, helper: BaseHelper) =>
    camelcase(`create_${getOperationName(operation, helper)}_operation`),
} as const
