import { OperationObject } from '@oats-ts/openapi-model'
import { camelCase } from 'lodash'

export const SdkImplDefaultLocals = {
  adapterParameter: 'adapter',
  adapterProperty: 'adapter',
  request: 'request',
  operationFactoryMethod: (operation: OperationObject) => camelCase(`create_${operation.operationId}_operation`),
} as const
