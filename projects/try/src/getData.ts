import { stringify } from '@oats-ts/validators'
import { isFailure } from './isFailure'
import { Try } from './types'

export function getData<T>(input: Try<T>): T {
  if (isFailure(input)) {
    throw new TypeError(input.issues.map(stringify).join('\n'))
  }
  return input.data
}
