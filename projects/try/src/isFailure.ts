import { Failure, Try } from './types'

export function isFailure(input: Try<unknown>): input is Failure {
  return input !== null && input !== undefined && Object.prototype.hasOwnProperty.call(input, 'issues')
}
