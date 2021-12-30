import { Failure, Try } from './types'

export function isFailure(input: Try<unknown>): input is Failure {
  return Object.prototype.hasOwnProperty.call(input, 'issues')
}
