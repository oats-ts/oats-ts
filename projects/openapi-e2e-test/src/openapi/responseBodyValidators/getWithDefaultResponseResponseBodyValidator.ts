import { namedSimpleObjectTypeValidator } from '../typeValidators/namedSimpleObjectTypeValidator'

export const getWithDefaultResponseResponseBodyValidator = {
  default: { 'application/json': namedSimpleObjectTypeValidator },
} as const
