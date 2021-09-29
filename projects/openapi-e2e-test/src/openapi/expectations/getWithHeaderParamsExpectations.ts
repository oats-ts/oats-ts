import { ResponseExpectations } from '@oats-ts/openapi-http'
import { namedSimpleObjectValidator } from '../validators/namedSimpleObjectValidator'

export const getWithHeaderParamsExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
}
