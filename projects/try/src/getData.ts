import { isFailure } from './isFailure'
import { Try } from './types'

export function getData<T>(input: Try<T>): T {
  if (isFailure(input)) {
    throw new TypeError(`Can't get value of Failure (${input})`)
  }
  return input.data
}
