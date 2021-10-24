import { namedSimpleObjectTypeValidator } from '../typeValidators/namedSimpleObjectTypeValidator'

export const getWithQueryParamsResponseBodyValidator = {
  200: { 'application/json': namedSimpleObjectTypeValidator },
} as const
