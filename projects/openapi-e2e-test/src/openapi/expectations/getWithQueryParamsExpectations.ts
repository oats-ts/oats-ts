import { ResponseExpectations } from '@oats-ts/openapi-http'
import { namedSimpleObjectValidator } from '../validators/namedSimpleObjectValidator'

export const getWithQueryParamsExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
}
