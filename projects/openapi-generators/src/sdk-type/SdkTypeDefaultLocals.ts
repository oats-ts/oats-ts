import { PathProviderHelper } from '@oats-ts/oats-ts'
import { OperationObject } from '@oats-ts/openapi-model'
import { camelCase } from 'lodash'

export const SdkTypeDefaultLocals = {
  sdkMethod: (operation: OperationObject, helper: PathProviderHelper): string => camelCase(operation.operationId),
} as const
