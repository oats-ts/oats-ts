import { array, items, lazy } from '@oats-ts/validators'
import { pathParametersPayloadTypeValidator } from '../typeValidators/pathParametersPayloadTypeValidator'
import { serverIssueTypeValidator } from '../typeValidators/serverIssueTypeValidator'

export const matrixPathParametersResponseBodyValidator = {
  200: { 'application/json': pathParametersPayloadTypeValidator },
  400: { 'application/json': array(items(lazy(() => serverIssueTypeValidator))) },
} as const
