import { namedSimpleObjectTypeValidator } from '../typeValidators/namedSimpleObjectTypeValidator'

export const postSimpleNamedObjectRequestBodyValidator = { 'application/json': namedSimpleObjectTypeValidator } as const
