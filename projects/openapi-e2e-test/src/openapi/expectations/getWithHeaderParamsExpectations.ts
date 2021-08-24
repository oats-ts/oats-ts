import { ResponseExpectations } from '@oats-ts/http'
import { namedSimpleObjectValidator } from '../validators/namedSimpleObjectValidator'

export const getWithHeaderParamsExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
}
