import { ResponseExpectations } from '@oats-ts/http'
import { string } from '@oats-ts/validators'
import { namedComplexObjectValidator } from '../validators/namedComplexObjectValidator'

export const sampleOperationExpectations: ResponseExpectations = {
  200: { 'application/json': namedComplexObjectValidator },
  201: { 'text/plain': string() },
}
