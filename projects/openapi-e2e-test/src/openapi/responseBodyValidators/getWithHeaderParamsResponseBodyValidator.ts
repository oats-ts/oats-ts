import { namedSimpleObjectTypeValidator } from '../typeValidators/namedSimpleObjectTypeValidator'

export const getWithHeaderParamsResponseBodyValidator = {
  200: { 'application/json': namedSimpleObjectTypeValidator },
} as const
