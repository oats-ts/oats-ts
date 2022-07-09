import { isFailure } from './isFailure'
import { isSuccess } from './isSuccess'
import { Try } from './types'

export function isTry<T>(input: unknown): input is Try<T> {
  return isSuccess(input as Try<T>) || isFailure(input as Try<T>)
}
