import { namedSimpleObjectTypeValidator } from '../typeValidators/namedSimpleObjectTypeValidator'

export const getSimpleNamedObjectResponseBodyValidator = {
  200: { 'application/json': namedSimpleObjectTypeValidator },
} as const
