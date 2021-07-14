import { ResponseExpectations } from '@oats-ts/http'
import { namedSimpleObjectValidator } from '../validators/namedSimpleObjectValidator'

export const getWithDefaultResponseExpectations: ResponseExpectations = {
  default: { 'application/json': namedSimpleObjectValidator },
}
