import { namedSimpleObjectTypeValidator } from '../typeValidators/namedSimpleObjectTypeValidator'

export const getWithPathParamsResponseBodyValidator = {
  200: { 'application/json': namedSimpleObjectTypeValidator },
} as const
