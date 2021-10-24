import { string } from '@oats-ts/validators'
import { namedComplexObjectTypeValidator } from '../typeValidators/namedComplexObjectTypeValidator'

export const sampleOperationResponseBodyValidator = {
  200: { 'application/json': namedComplexObjectTypeValidator },
  201: { 'text/plain': string() },
} as const
