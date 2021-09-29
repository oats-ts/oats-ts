import { ResponseExpectations } from '@oats-ts/openapi-http'
import { namedSimpleObjectValidator } from '../validators/namedSimpleObjectValidator'

export const getWithDefaultResponseExpectations: ResponseExpectations = {
  default: { 'application/json': namedSimpleObjectValidator },
}
