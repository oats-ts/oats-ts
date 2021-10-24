import { namedSimpleObjectTypeValidator } from '../typeValidators/namedSimpleObjectTypeValidator'

export const postSimpleNamedObjectResponseBodyValidator = {
  200: { 'application/json': namedSimpleObjectTypeValidator },
} as const
