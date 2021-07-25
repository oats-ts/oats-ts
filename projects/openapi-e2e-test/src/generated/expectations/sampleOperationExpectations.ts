import { ResponseExpectations } from '@oats-ts/http'
import { namedComplexObjectValidator } from '../validators/namedComplexObjectValidator'
import { string } from '@oats-ts/validators'

export const sampleOperationExpectations: ResponseExpectations = {
  200: { 'application/json': namedComplexObjectValidator },
  201: { 'text/plain': string() },
}
