import { ResponseExpectations } from '@oats-ts/openapi-http'
import { namedSimpleObjectValidator } from '../validators/namedSimpleObjectValidator'

export const getSimpleNamedObjectExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
}
