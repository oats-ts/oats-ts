import { LocalNameProviderHelper } from '@oats-ts/oats-ts'
import { getOperationName } from '@oats-ts/openapi-common'
import { OperationObject } from '@oats-ts/openapi-model'
import camelCase from 'camelcase'

export const SdkTypeDefaultLocals = {
  sdkMethod: (operation: OperationObject, helper: LocalNameProviderHelper): string =>
    camelCase(getOperationName(operation, helper)),
} as const
