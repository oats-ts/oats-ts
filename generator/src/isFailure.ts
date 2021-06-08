import { Failure, Try } from './typings'

export function isFailure(input: Try<any>): input is Failure {
  return typeof input === 'object' && Array.isArray(input.issues)
}
