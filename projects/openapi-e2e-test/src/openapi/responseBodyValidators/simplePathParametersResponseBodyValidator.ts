import { simpleObjectTypeValidator } from '../typeValidators/simpleObjectTypeValidator'

export const simplePathParametersResponseBodyValidator = {
  200: { 'application/json': simpleObjectTypeValidator },
} as const
