import { ResponseExpectations } from '@oats-ts/http'
import { namedSimpleObjectValidator } from '../validators/namedSimpleObjectValidator'

export const getSimpleNamedObjectExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
}
