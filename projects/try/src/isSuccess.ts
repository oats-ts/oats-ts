import { Success, Try } from './types'

export function isSuccess<T>(input: Try<T>): input is Success<T> {
  return Object.prototype.hasOwnProperty.call(input, 'data')
}
