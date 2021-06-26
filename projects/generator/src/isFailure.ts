import { Failure, Try } from './typings'

export function isFailure(input: Try<any>): input is Failure {
  return input !== null && typeof input === 'object' && Array.isArray(input.issues)
}
