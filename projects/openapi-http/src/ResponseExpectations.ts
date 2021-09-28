import { ResponseExpectation } from './ResponseExpectation'

export type ResponseExpectations<V = unknown> = {
  [statusCode: number]: ResponseExpectation<V>
  default?: ResponseExpectation<V>
}
