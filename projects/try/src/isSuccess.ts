import { SUCCESS_SYMBOL } from './symbols'
import { Success, Try } from './types'

export function isSuccess<T>(input?: Try<T>): input is Success<T> {
  return typeof input === 'object' && input !== null && (input as any)[SUCCESS_SYMBOL] === true
}
