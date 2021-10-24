import { string } from '@oats-ts/validators'
import { namedSimpleObjectTypeValidator } from '../typeValidators/namedSimpleObjectTypeValidator'

export const sampleOperationRequestBodyValidator = {
  'application/json': namedSimpleObjectTypeValidator,
  'text/plain': string(),
} as const
