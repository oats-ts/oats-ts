import { ResponseExpectations } from '@oats-ts/http'
import { namedSimpleObjectValidator } from '../validators/namedSimpleObjectValidator'

export const getWithPathParamsExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
}
